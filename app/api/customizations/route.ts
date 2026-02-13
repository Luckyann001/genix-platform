import { NextRequest } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import {
  errorResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/api-response'
import {
  DEFAULT_PREVIEW_CUSTOMIZATION,
  normalizePreviewCustomization,
} from '@/lib/customization-config'

export const dynamic = 'force-dynamic'

type PurchaseGateResult = {
  ok: boolean
  purchaseId: string | null
  error?: string
  statusCode?: number
}

async function assertBuyerCanCustomize(
  adminSupabase: any,
  userId: string,
  templateId: string,
  purchaseId?: string | null
): Promise<PurchaseGateResult> {
  if (purchaseId) {
    const { data, error } = await adminSupabase
      .from('purchases')
      .select('id, template_id, status')
      .eq('id', purchaseId)
      .eq('buyer_id', userId)
      .eq('template_id', templateId)
      .maybeSingle()

    if (error) throw error
    if (!data) {
      return { ok: false, purchaseId: null, error: 'Purchase not found for this template', statusCode: 404 }
    }
    if (String(data.status || '') !== 'completed') {
      return { ok: false, purchaseId: null, error: 'Purchase is not completed yet', statusCode: 403 }
    }

    return { ok: true, purchaseId: String(data.id) }
  }

  const { data, error } = await adminSupabase
    .from('purchases')
    .select('id')
    .eq('buyer_id', userId)
    .eq('template_id', templateId)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  if (!data) {
    return {
      ok: false,
      purchaseId: null,
      error: 'You can only customize templates you have purchased',
      statusCode: 403,
    }
  }

  return { ok: true, purchaseId: String(data.id) }
}

function isMissingCustomizationTable(error: unknown): boolean {
  const message = String((error as any)?.message || '').toLowerCase()
  return (
    message.includes('buyer_template_customizations') &&
    (message.includes('does not exist') || message.includes('missing'))
  )
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { searchParams } = new URL(request.url)
    const templateId = String(searchParams.get('templateId') || '').trim()
    const purchaseId = String(searchParams.get('purchaseId') || '').trim() || null

    if (!templateId) return errorResponse('templateId is required')

    const gate = await assertBuyerCanCustomize(adminSupabase, user.id, templateId, purchaseId)
    if (!gate.ok) return errorResponse(gate.error || 'Forbidden', gate.statusCode || 403)

    const query = adminSupabase
      .from('buyer_template_customizations')
      .select('id, config, purchase_id, updated_at')
      .eq('user_id', user.id)
      .eq('template_id', templateId)
      .eq('purchase_id', gate.purchaseId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const { data, error } = await query
    if (error) throw error

    return successResponse({
      customization: normalizePreviewCustomization(data?.config || DEFAULT_PREVIEW_CUSTOMIZATION),
      purchaseId: gate.purchaseId,
      hasSaved: Boolean(data),
      updatedAt: data?.updated_at || null,
    })
  } catch (error) {
    if (isMissingCustomizationTable(error)) {
      return errorResponse('Missing buyer_template_customizations table. Run the latest migration.', 500)
    }
    return serverErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json()
    const templateId = String(body?.templateId || '').trim()
    const purchaseId = String(body?.purchaseId || '').trim() || null

    if (!templateId) return errorResponse('templateId is required')

    const gate = await assertBuyerCanCustomize(adminSupabase, user.id, templateId, purchaseId)
    if (!gate.ok) return errorResponse(gate.error || 'Forbidden', gate.statusCode || 403)

    const config = normalizePreviewCustomization(body?.config)

    const { data: existing, error: existingError } = await adminSupabase
      .from('buyer_template_customizations')
      .select('id')
      .eq('user_id', user.id)
      .eq('template_id', templateId)
      .eq('purchase_id', gate.purchaseId)
      .maybeSingle()

    if (existingError) throw existingError

    if (existing?.id) {
      const { data, error } = await adminSupabase
        .from('buyer_template_customizations')
        .update({
          config,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('id, purchase_id, template_id, config, updated_at')
        .single()

      if (error) throw error
      return successResponse({ message: 'Customization saved', customization: data })
    }

    const { data, error } = await adminSupabase
      .from('buyer_template_customizations')
      .insert({
        user_id: user.id,
        template_id: templateId,
        purchase_id: gate.purchaseId,
        config,
      })
      .select('id, purchase_id, template_id, config, updated_at')
      .single()

    if (error) throw error
    return successResponse({ message: 'Customization saved', customization: data }, 201)
  } catch (error) {
    if (isMissingCustomizationTable(error)) {
      return errorResponse('Missing buyer_template_customizations table. Run the latest migration.', 500)
    }
    return serverErrorResponse(error)
  }
}
