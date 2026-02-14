import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, notFoundResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'
import { getMarketplaceTemplateBySlugOrId } from '@/lib/templates'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
  const template = await getMarketplaceTemplateBySlugOrId(id)
  if (!template) return notFoundResponse('Template not found')
	return successResponse(template)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  try {
    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user
    if (!user) return unauthorizedResponse()

    const payload = await request.json()

    const name = String(payload?.name || '').trim()
    const longDescription = String(payload?.longDescription || '').trim()
    const shortDescription = String(payload?.shortDescription || '').trim()
    const category = String(payload?.category || '').trim().toLowerCase()
    const githubUrl = String(payload?.githubUrl || '').trim()
    const demoUrl = String(payload?.demoUrl || '').trim()
    const rawPrice = Number(payload?.price || 0)
    const features = Array.isArray(payload?.features)
      ? payload.features.map((feature: unknown) => String(feature).trim()).filter(Boolean)
      : []
    const exclusivePurchaseAvailable = Boolean(payload?.exclusivePurchaseAvailable)
    const rawExclusivePrice = Number(payload?.exclusivePrice || 0)
    const supportPackageAvailable = Boolean(payload?.supportPackageAvailable)
    const rawSupportPackagePrice = Number(payload?.supportPackagePrice || 0)
    const supportEmail = String(payload?.supportEmail || '').trim()
    const supportChannel = String(payload?.supportChannel || '').trim()
    const supportTimezone = String(payload?.supportTimezone || '').trim()
    const supportResponseSlaHours = Number(payload?.supportResponseSlaHours || 0)
    const supportDurationDays = Number(payload?.supportDurationDays || 0)
    const supportIncluded = String(payload?.supportIncluded || '').trim()
    const supportExcluded = String(payload?.supportExcluded || '').trim()
    const guideBackendSetup = String(payload?.guideBackendSetup || '').trim()
    const guideAuthSetup = String(payload?.guideAuthSetup || '').trim()
    const guidePaymentsSetup = String(payload?.guidePaymentsSetup || '').trim()
    const guideAiBillingSetup = String(payload?.guideAiBillingSetup || '').trim()
    const guidePrivacySecurity = String(payload?.guidePrivacySecurity || '').trim()
    const guideDeploymentRunbook = String(payload?.guideDeploymentRunbook || '').trim()

    if (!name || !longDescription || !shortDescription || !category || !githubUrl || !demoUrl || rawPrice <= 0) {
      return errorResponse('Missing required fields')
    }
    if (
      !supportEmail ||
      !supportChannel ||
      !supportTimezone ||
      supportResponseSlaHours <= 0 ||
      supportDurationDays <= 0 ||
      !supportIncluded ||
      !supportExcluded
    ) {
      return errorResponse('Support package details are required')
    }
    if (
      !guideBackendSetup ||
      !guideAuthSetup ||
      !guidePaymentsSetup ||
      !guideAiBillingSetup ||
      !guidePrivacySecurity ||
      !guideDeploymentRunbook
    ) {
      return errorResponse('Setup guide is required for all templates')
    }

    const { data: existing, error: fetchError } = await supabase
      .from('templates')
      .select('id, developer_id, preview_data')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) throw fetchError
    if (!existing) return notFoundResponse('Template not found')
    if (String(existing.developer_id || '') !== user.id) return unauthorizedResponse('Developer ownership required')

    const existingPreviewData =
      existing.preview_data && typeof existing.preview_data === 'object' ? existing.preview_data : {}
    const existingReviewStatus = String(existingPreviewData.review_status || '').toLowerCase()

    const nextPreviewData = {
      ...existingPreviewData,
      summary: shortDescription || longDescription.slice(0, 160),
      tech_stack: {
        database: String(payload?.database || '').trim(),
        authentication: String(payload?.authentication || '').trim(),
        payment_provider: String(payload?.paymentProvider || '').trim(),
        other_tools: String(payload?.otherTools || '').trim(),
      },
      consultation: {
        enabled: Boolean(payload?.consultationAvailable),
        hourly_rate: payload?.consultationRate ? Number(payload.consultationRate) : null,
      },
      support: {
        email: supportEmail,
        channel: supportChannel,
        timezone: supportTimezone,
        response_sla_hours: Math.round(supportResponseSlaHours),
        duration_days: Math.round(supportDurationDays),
        included: supportIncluded,
        excluded: supportExcluded,
      },
      setup_guide: {
        backend_setup: guideBackendSetup,
        auth_setup: guideAuthSetup,
        payments_setup: guidePaymentsSetup,
        ai_billing_setup: guideAiBillingSetup,
        privacy_security: guidePrivacySecurity,
        deployment_runbook: guideDeploymentRunbook,
      },
    }

    if (existingReviewStatus === 'approved') {
      nextPreviewData.review_status = 'pending'
      nextPreviewData.review_feedback = null
      nextPreviewData.re_review_requested_at = new Date().toISOString()
      nextPreviewData.re_review_requested_by = user.id
    }

    const exclusivePrice =
      exclusivePurchaseAvailable && !Number.isNaN(rawExclusivePrice) && rawExclusivePrice > 0
        ? Math.round(rawExclusivePrice)
        : null
    const supportPackagePrice =
      supportPackageAvailable && !Number.isNaN(rawSupportPackagePrice) && rawSupportPackagePrice > 0
        ? Math.round(rawSupportPackagePrice)
        : null

    const { data: updated, error: updateError } = await supabase
      .from('templates')
      .update({
        name,
        description: longDescription,
        category,
        price: Math.round(rawPrice),
        github_url: githubUrl,
        demo_url: demoUrl,
        features,
        exclusive_purchase_available: exclusivePurchaseAvailable,
        exclusive_price: exclusivePrice,
        support_package_available: supportPackageAvailable,
        support_package_price: supportPackagePrice,
        preview_data: nextPreviewData,
      })
      .eq('id', id)
      .eq('developer_id', user.id)
      .select('id, name, slug, category, price, preview_data, updated_at')
      .single()

    if (updateError) throw updateError

    return successResponse({
      message:
        existingReviewStatus === 'approved'
          ? 'Template updated and moved back to pending review.'
          : 'Template updated successfully.',
      template: updated,
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
