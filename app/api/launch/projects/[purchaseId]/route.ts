import { NextRequest } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

function isMissingLaunchTables(error: unknown): boolean {
  const message = String((error as any)?.message || '').toLowerCase()
  return message.includes('buyer_launch_projects') || message.includes('buyer_hosting_connections')
}

function normalizeTemplateRow(raw: any) {
  if (Array.isArray(raw)) return raw[0] || null
  return raw || null
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ purchaseId: string }> }) {
  const { purchaseId } = await params
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { data: purchase, error: purchaseError } = await adminSupabase
      .from('purchases')
      .select(
        'id, buyer_id, status, template_id, launch_status, launch_live_url, launch_admin_url, template:templates(id, name, github_url, demo_url, preview_data)'
      )
      .eq('id', purchaseId)
      .maybeSingle()

    if (purchaseError) throw purchaseError
    if (!purchase || String(purchase.buyer_id) !== user.id) return errorResponse('Purchase not found', 404)
    if (String(purchase.status || '') !== 'completed') return errorResponse('Purchase is not completed yet', 403)

    const { data: existingProject, error: projectError } = await adminSupabase
      .from('buyer_launch_projects')
      .select('*')
      .eq('purchase_id', purchaseId)
      .eq('buyer_id', user.id)
      .maybeSingle()

    if (projectError) throw projectError

    let project = existingProject
    if (!project) {
      const { data: inserted, error: insertError } = await adminSupabase
        .from('buyer_launch_projects')
        .insert({
          purchase_id: purchaseId,
          buyer_id: user.id,
          template_id: purchase.template_id,
          status: 'onboarding',
          onboarding_data: {
            brand_name: normalizeTemplateRow((purchase as any)?.template)?.name || '',
            domain: '',
            domain_mode: 'genix_subdomain',
            genix_subdomain: '',
            custom_domain: '',
            custom_domain_provider: '',
            custom_domain_dns_verified: false,
            custom_domain_verified: false,
            business_email: user.email || '',
            payment_account: '',
            legal_pages_ready: false,
          },
        })
        .select('*')
        .single()

      if (insertError) throw insertError
      project = inserted
    }

    const { data: hostingConnection, error: hostingError } = await adminSupabase
      .from('buyer_hosting_connections')
      .select('id, provider, connected_at, provider_account_id')
      .eq('buyer_id', user.id)
      .eq('provider', 'vercel')
      .maybeSingle()

    if (hostingError) throw hostingError

    const templateRow = normalizeTemplateRow((purchase as any).template)
    const templatePreviewData =
      templateRow?.preview_data && typeof templateRow.preview_data === 'object' ? templateRow.preview_data : {}
    const setupGuide =
      templatePreviewData.setup_guide && typeof templatePreviewData.setup_guide === 'object'
        ? templatePreviewData.setup_guide
        : {}

    return successResponse({
      purchase: {
        id: purchase.id,
        template_id: purchase.template_id,
        status: purchase.status,
        launch_status: purchase.launch_status,
        launch_live_url: purchase.launch_live_url,
        launch_admin_url: purchase.launch_admin_url,
      },
      template: templateRow
        ? {
            id: templateRow.id,
            name: templateRow.name,
            github_url: templateRow.github_url || null,
            demo_url: templateRow.demo_url || null,
            setup_guide: {
              backend_setup: String(setupGuide.backend_setup || ''),
              auth_setup: String(setupGuide.auth_setup || ''),
              payments_setup: String(setupGuide.payments_setup || ''),
              ai_billing_setup: String(setupGuide.ai_billing_setup || ''),
              privacy_security: String(setupGuide.privacy_security || ''),
              deployment_runbook: String(setupGuide.deployment_runbook || ''),
            },
          }
        : null,
      project,
      hostingConnection: hostingConnection || null,
    })
  } catch (error) {
    if (isMissingLaunchTables(error)) {
      return errorResponse('Missing launch flow tables. Run the latest migration.', 500)
    }
    return serverErrorResponse(error)
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ purchaseId: string }> }) {
  const { purchaseId } = await params
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json().catch(() => ({}))

    const { data: purchase, error: purchaseError } = await adminSupabase
      .from('purchases')
      .select('id, buyer_id, status, template_id')
      .eq('id', purchaseId)
      .maybeSingle()

    if (purchaseError) throw purchaseError
    if (!purchase || String(purchase.buyer_id) !== user.id) return errorResponse('Purchase not found', 404)
    if (String(purchase.status || '') !== 'completed') return errorResponse('Purchase is not completed yet', 403)

    const onboardingData = body?.onboardingData && typeof body.onboardingData === 'object' ? body.onboardingData : null
    const postLaunchSettings =
      body?.postLaunchSettings && typeof body.postLaunchSettings === 'object' ? body.postLaunchSettings : null

    const updatePayload: Record<string, any> = {}
    if (onboardingData) updatePayload.onboarding_data = onboardingData
    if (postLaunchSettings) updatePayload.post_launch_settings = postLaunchSettings
    if (String(body?.status || '').trim()) updatePayload.status = String(body.status).trim()

    if (Object.keys(updatePayload).length === 0) return errorResponse('Nothing to update', 400)

    const { data, error } = await adminSupabase
      .from('buyer_launch_projects')
      .update(updatePayload)
      .eq('purchase_id', purchaseId)
      .eq('buyer_id', user.id)
      .select('*')
      .single()

    if (error) throw error

    await adminSupabase
      .from('purchases')
      .update({ launch_status: data.status === 'live' ? 'live' : 'onboarding' })
      .eq('id', purchaseId)
      .eq('buyer_id', user.id)

    return successResponse({ project: data, message: 'Launch project updated' })
  } catch (error) {
    if (isMissingLaunchTables(error)) {
      return errorResponse('Missing launch flow tables. Run the latest migration.', 500)
    }
    return serverErrorResponse(error)
  }
}
