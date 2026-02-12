import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

const REFUND_WINDOW_DAYS = 30

function refundDeadlineDate(createdAt: string) {
  const created = new Date(createdAt)
  created.setDate(created.getDate() + REFUND_WINDOW_DAYS)
  return created
}

export async function GET() {
  const supabase = createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { data, error } = await supabase
      .from('refund_requests')
      .select('*, purchase:purchases(id, template_id, price, status, created_at)')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return successResponse({ refunds: data || [] })
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('refund_requests')) {
      return errorResponse('Missing refund_requests table. Run the latest migration.', 500)
    }
    return serverErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json()
    const purchaseId = String(body?.purchaseId || '').trim()
    const reason = String(body?.reason || '').trim()
    const deployed = Boolean(body?.deployed)

    if (!purchaseId || !reason) {
      return errorResponse('purchaseId and reason are required')
    }

    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('id, buyer_id, seller_id, price, status, created_at, refund_status')
      .eq('id', purchaseId)
      .eq('buyer_id', user.id)
      .single()

    if (purchaseError || !purchase) {
      return errorResponse('Purchase not found', 404)
    }

    if (purchase.status !== 'completed') {
      return errorResponse('Only completed purchases can be refunded')
    }

    const deadline = refundDeadlineDate(purchase.created_at)
    if (new Date() > deadline) {
      return errorResponse('Refund window has expired for this purchase')
    }

    if (purchase.refund_status === 'approved' || purchase.refund_status === 'pending') {
      return errorResponse('Refund already requested for this purchase')
    }

    const { data: existing } = await supabase
      .from('refund_requests')
      .select('id, status')
      .eq('purchase_id', purchaseId)
      .in('status', ['pending', 'approved'])
      .maybeSingle()

    if (existing) {
      return errorResponse('Refund already requested for this purchase')
    }

    const { data, error } = await supabase
      .from('refund_requests')
      .insert({
        purchase_id: purchaseId,
        buyer_id: user.id,
        seller_id: purchase.seller_id,
        amount: purchase.price,
        reason,
        deployed,
        status: 'pending',
      })
      .select('*')
      .single()

    if (error) throw error

    await supabase.from('purchases').update({ refund_status: 'pending' }).eq('id', purchaseId)

    if (purchase.seller_id) {
      await supabase.from('notifications').insert({
        user_id: purchase.seller_id,
        type: 'refund_requested',
        title: 'Refund Requested',
        message: 'A buyer has requested a refund for one of your template sales.',
        related_purchase_id: purchaseId,
        action_url: '/developer/earnings',
      })
    }

    return successResponse({ refund: data }, 201)
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('refund_requests')) {
      return errorResponse('Missing refund_requests table. Run the latest migration.', 500)
    }
    return serverErrorResponse(error)
  }
}
