import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { paystack } from '@/lib/paystack'
import { isAdminUser } from '@/lib/admin-auth'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

type EarningItem = {
  source_type: 'purchase' | 'consultation'
  source_id: string
  developer_id: string
  amount: number
  reference: string | null
}

function resolveRecipientCode(profile: Record<string, any> | null | undefined): string | null {
  if (!profile) return null
  const candidates = [
    profile.paystack_recipient_code,
    profile.recipient_code,
    profile.bank_recipient_code,
    profile.transfer_recipient_code,
  ]

  for (const value of candidates) {
    const normalized = String(value || '').trim()
    if (normalized) return normalized
  }

  return null
}

async function collectEarnings(supabase: ReturnType<typeof createClient>): Promise<EarningItem[]> {
  const [purchasesResult, consultationsResult] = await Promise.all([
    supabase
      .from('purchases')
      .select('id, seller_id, developer_earnings, payment_reference, status')
      .eq('status', 'completed'),
    supabase
      .from('consultations')
      .select('id, developer_id, developer_earnings, payment_reference, status')
      .eq('status', 'completed'),
  ])

  if (purchasesResult.error) throw purchasesResult.error
  if (consultationsResult.error) throw consultationsResult.error

  const purchases = (purchasesResult.data || []).map((row: any) => ({
    source_type: 'purchase' as const,
    source_id: String(row.id),
    developer_id: String(row.seller_id || ''),
    amount: Number(row.developer_earnings || 0),
    reference: row.payment_reference ? String(row.payment_reference) : null,
  }))

  const consultations = (consultationsResult.data || []).map((row: any) => ({
    source_type: 'consultation' as const,
    source_id: String(row.id),
    developer_id: String(row.developer_id || ''),
    amount: Number(row.developer_earnings || 0),
    reference: row.payment_reference ? String(row.payment_reference) : null,
  }))

  return [...purchases, ...consultations].filter(
    (item) => item.developer_id && Number.isFinite(item.amount) && item.amount > 0
  )
}

async function excludePreviouslyPaid(
  supabase: ReturnType<typeof createClient>,
  items: EarningItem[]
): Promise<EarningItem[]> {
  const { data, error } = await supabase
    .from('payout_transfers')
    .select('source_type, source_id, status')
    .in('status', ['queued', 'processing', 'paid'])

  if (error) throw error

  const paidKeys = new Set((data || []).map((row: any) => `${row.source_type}:${row.source_id}`))

  return items.filter((item) => !paidKeys.has(`${item.source_type}:${item.source_id}`))
}

export async function GET(request: NextRequest) {
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()
  if (!isAdminUser(user)) return unauthorizedResponse('Admin access required')

  try {
    const allItems = await collectEarnings(supabase)
    const pendingItems = await excludePreviouslyPaid(supabase, allItems)

    const totalPending = pendingItems.reduce((sum, item) => sum + item.amount, 0)

    return successResponse({
      pending_count: pendingItems.length,
      pending_total: totalPending,
      pending_items: pendingItems,
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()
  if (!isAdminUser(user)) return unauthorizedResponse('Admin access required')

  try {
    const body = await request.json().catch(() => ({}))
    const dryRun = Boolean(body?.dryRun ?? true)
    const limit = Math.max(1, Math.min(500, Number(body?.limit || 100)))

    const allItems = await collectEarnings(supabase)
    const pendingItems = (await excludePreviouslyPaid(supabase, allItems)).slice(0, limit)

    if (pendingItems.length === 0) {
      return successResponse({ processed: 0, message: 'No pending earnings to pay out' })
    }

    const developerIds = Array.from(new Set(pendingItems.map((item) => item.developer_id)))
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*').in('id', developerIds)
    if (profilesError) throw profilesError

    const profileMap = new Map<string, Record<string, any>>((profiles || []).map((profile: any) => [String(profile.id), profile]))

    const grouped = new Map<string, EarningItem[]>()
    for (const item of pendingItems) {
      const list = grouped.get(item.developer_id) || []
      list.push(item)
      grouped.set(item.developer_id, list)
    }

    const runResults: any[] = []

    for (const [developerId, items] of grouped.entries()) {
      const amount = items.reduce((sum, item) => sum + item.amount, 0)
      const profile = profileMap.get(developerId)
      const recipientCode = resolveRecipientCode(profile)

      const payoutReference = `payout_${Date.now()}_${developerId.slice(0, 8)}`

      let status: 'queued' | 'processing' | 'paid' | 'manual_required' | 'failed' = 'queued'
      let transferResponse: any = null
      let errorMessage: string | null = null

      if (!recipientCode) {
        status = 'manual_required'
        errorMessage = 'Missing transfer recipient code on developer profile'
      } else if (!dryRun) {
        try {
          status = 'processing'
          transferResponse = await (paystack as any).transfer.initiate({
            source: 'balance',
            reason: `Weekly payout for ${items.length} earnings`,
            amount: Math.round(amount * 100),
            recipient: recipientCode,
            reference: payoutReference,
          })

          status = 'paid'
        } catch (error: any) {
          status = 'failed'
          errorMessage = error?.message || 'Transfer initiation failed'
        }
      }

      const payoutRows = items.map((item) => ({
        developer_id: developerId,
        source_type: item.source_type,
        source_id: item.source_id,
        amount: item.amount,
        status,
        payout_reference: payoutReference,
        transfer_response: transferResponse,
        error_message: errorMessage,
      }))

      const { error: payoutInsertError } = await supabase.from('payout_transfers').insert(payoutRows)
      if (payoutInsertError) throw payoutInsertError

      runResults.push({
        developer_id: developerId,
        amount,
        entries: items.length,
        status,
        dry_run: dryRun,
        error_message: errorMessage,
      })
    }

    return successResponse({
      processed: pendingItems.length,
      grouped_developers: grouped.size,
      dry_run: dryRun,
      results: runResults,
    })
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('payout_transfers')) {
      return errorResponse('Missing payout_transfers table. Run the MVP phase migration first.', 500)
    }
    return serverErrorResponse(error)
  }
}
