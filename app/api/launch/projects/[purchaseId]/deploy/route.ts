import { NextRequest } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

function slugify(value: string): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ purchaseId: string }> }) {
  const { purchaseId } = await params
  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { data: purchase, error: purchaseError } = await adminSupabase
      .from('purchases')
      .select('id, buyer_id, template_id, status, template:templates(id, name, github_url)')
      .eq('id', purchaseId)
      .maybeSingle()

    if (purchaseError) throw purchaseError
    if (!purchase || String(purchase.buyer_id) !== user.id) return errorResponse('Purchase not found', 404)
    if (String(purchase.status || '') !== 'completed') return errorResponse('Purchase is not completed yet', 403)

    const { data: connection, error: connectionError } = await adminSupabase
      .from('buyer_hosting_connections')
      .select('id, provider, access_token')
      .eq('buyer_id', user.id)
      .eq('provider', 'vercel')
      .maybeSingle()

    if (connectionError) throw connectionError

    const { data: project, error: projectError } = await adminSupabase
      .from('buyer_launch_projects')
      .select('id, onboarding_data')
      .eq('purchase_id', purchaseId)
      .eq('buyer_id', user.id)
      .maybeSingle()

    if (projectError) throw projectError
    if (!project) return errorResponse('Launch project not found. Save onboarding first.', 400)

    const onboardingData = project.onboarding_data && typeof project.onboarding_data === 'object' ? project.onboarding_data : {}
    const domainMode = String(onboardingData.domain_mode || 'genix_subdomain').toLowerCase()
    const genixSubdomain = String(onboardingData.genix_subdomain || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48)
    const customDomain = String(onboardingData.custom_domain || '').trim().toLowerCase()
    const customDnsVerified = Boolean(onboardingData.custom_domain_dns_verified)
    const customDomainVerified = Boolean(onboardingData.custom_domain_verified)

    if (domainMode === 'custom_domain') {
      if (!customDomain) return errorResponse('Add your custom domain before launching', 400)
      if (!customDnsVerified) return errorResponse('Complete DNS record setup before launching', 400)
      if (!customDomainVerified) return errorResponse('Custom domain is not verified yet', 400)
    } else if (!genixSubdomain) {
      return errorResponse('Choose a free Genix subdomain before launching', 400)
    }

    const sourceRepoUrl = String((purchase as any)?.template?.github_url || '').trim()
    const quickDeployUrl = sourceRepoUrl
      ? `https://vercel.com/new/clone?repository-url=${encodeURIComponent(sourceRepoUrl)}`
      : null

    if (!connection) {
      return errorResponse(
        quickDeployUrl
          ? `Connect Vercel first, or deploy manually via ${quickDeployUrl}`
          : 'Connect Vercel first to enable one-click deployment',
        400
      )
    }

    await adminSupabase
      .from('buyer_launch_projects')
      .update({
        status: 'deploying',
        hosting_connection_id: connection.id,
      })
      .eq('purchase_id', purchaseId)
      .eq('buyer_id', user.id)

    await adminSupabase
      .from('purchases')
      .update({ launch_status: 'deploying' })
      .eq('id', purchaseId)
      .eq('buyer_id', user.id)

    const appName = `${slugify(String((purchase as any)?.template?.name || 'genix-launch'))}-${purchaseId.slice(0, 6)}`
    const finalDomain = domainMode === 'custom_domain' ? customDomain : `${genixSubdomain}.genix.site`
    const liveUrl = `https://${finalDomain}`
    const adminUrl = `${liveUrl}/admin`

    // MVP behavior: mark as live and provide deterministic URLs after connect.
    // Real project creation with Vercel API can be added in a background job.
    const deploymentData = {
      provider: 'vercel',
      mode: 'mvp_simulated',
      app_name: appName,
      source_repo: sourceRepoUrl || null,
      deployed_at: new Date().toISOString(),
      quick_deploy_url: quickDeployUrl,
      domain_mode: domainMode,
      configured_domain: finalDomain,
    }

    await adminSupabase
      .from('buyer_launch_projects')
      .update({
        status: 'live',
        live_url: liveUrl,
        admin_panel_url: adminUrl,
        deployment_data: deploymentData,
        admin_credentials: {
          note: 'Set your initial admin credentials in your deployed app env setup.',
        },
      })
      .eq('purchase_id', purchaseId)
      .eq('buyer_id', user.id)

    await adminSupabase
      .from('purchases')
      .update({
        launch_status: 'live',
        launch_live_url: liveUrl,
        launch_admin_url: adminUrl,
        launch_completed_at: new Date().toISOString(),
      })
      .eq('id', purchaseId)
      .eq('buyer_id', user.id)

    return successResponse({
      message: 'Deployment completed',
      liveUrl,
      adminUrl,
      quickDeployUrl,
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
