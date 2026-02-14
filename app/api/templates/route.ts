import { createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'
import { listMarketplaceTemplates } from '@/lib/templates'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')

  if (!slug) return 'template'
  return slug.slice(0, 80).replace(/-+$/g, '') || 'template'
}

export async function GET() {
  const templates = await listMarketplaceTemplates()
  return successResponse({ templates })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  try {
    const payload = await request.json()

    const name = String(payload?.name || '').trim()
    const longDescription = String(payload?.longDescription || '').trim()
    const shortDescription = String(payload?.shortDescription || '').trim()
    const category = String(payload?.category || '').trim().toLowerCase()
    const githubUrl = String(payload?.githubUrl || '').trim()
    const demoUrl = String(payload?.demoUrl || '').trim()
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
    const features = Array.isArray(payload?.features)
      ? payload.features.map((feature: unknown) => String(feature).trim()).filter(Boolean)
      : []
    const rawPrice = Number(payload?.price)

    if (!name || !longDescription || !category || !githubUrl || Number.isNaN(rawPrice) || rawPrice <= 0) {
      return errorResponse('Missing required fields')
    }
    if (
      !supportEmail ||
      !supportChannel ||
      !supportTimezone ||
      Number.isNaN(supportResponseSlaHours) ||
      supportResponseSlaHours <= 0 ||
      Number.isNaN(supportDurationDays) ||
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

    const { data: authData } = await supabase.auth.getUser()
    const developerId = authData.user?.id
    if (!developerId) return unauthorizedResponse()

    const exclusivePrice =
      exclusivePurchaseAvailable && !Number.isNaN(rawExclusivePrice) && rawExclusivePrice > 0
        ? Math.round(rawExclusivePrice)
        : null

    const supportPackagePrice =
      supportPackageAvailable && !Number.isNaN(rawSupportPackagePrice) && rawSupportPackagePrice > 0
        ? Math.round(rawSupportPackagePrice)
        : null

    const previewData = {
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
      capability_map: {
        editable: ['Text', 'Theme', 'Images', 'Sections'],
        notEditable: ['Backend logic', 'Auth flow'],
      },
      review_status: 'pending',
    }

    const baseSlug = slugify(name)
    let insertData: any = null
    let insertError: any = null

    for (let attempt = 0; attempt < 5; attempt++) {
      const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`

      const result = await supabase
        .from('templates')
        .insert({
          name,
          slug,
          description: longDescription,
          price: Math.round(rawPrice),
          category,
          github_url: githubUrl,
          demo_url: demoUrl || null,
          features,
          preview_data: previewData,
          developer_id: developerId,
          exclusive_purchase_available: exclusivePurchaseAvailable,
          exclusive_price: exclusivePrice,
          support_package_available: supportPackageAvailable,
          support_package_price: supportPackagePrice,
        })
        .select('id, name, slug, category, price, created_at')
        .single()

      insertData = result.data
      insertError = result.error

      const isSlugConflict =
        insertError &&
        (String(insertError.code || '') === '23505' || String(insertError.message || '').toLowerCase().includes('slug'))

      if (!isSlugConflict) break
    }

    if (insertError) {
      const dbMessage = String(insertError.message || '').trim()
      if (dbMessage) {
        return errorResponse(`Template submission failed: ${dbMessage}`, 500)
      }
      return errorResponse('Template submission failed due to a database error', 500)
    }

    return successResponse(
      {
        message: 'Template submitted successfully. It is pending review before going live.',
        template: insertData,
      },
      201
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}
