import { createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'
import { listMarketplaceTemplates } from '@/lib/templates'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

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
    const features = Array.isArray(payload?.features)
      ? payload.features.map((feature: unknown) => String(feature).trim()).filter(Boolean)
      : []
    const rawPrice = Number(payload?.price)

    if (!name || !longDescription || !category || !githubUrl || Number.isNaN(rawPrice) || rawPrice <= 0) {
      return errorResponse('Missing required fields')
    }

    const { data: authData } = await supabase.auth.getUser()
    const developerId = authData.user?.id
    if (!developerId) return unauthorizedResponse()

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
      capability_map: {
        editable: ['Text', 'Theme', 'Images', 'Sections'],
        notEditable: ['Backend logic', 'Auth flow'],
      },
      review_status: 'pending',
    }

    const { data, error } = await supabase
      .from('templates')
      .insert({
        name,
        description: longDescription,
        price: Math.round(rawPrice),
        category,
        github_url: githubUrl,
        demo_url: demoUrl || null,
        features,
        preview_data: previewData,
        developer_id: developerId,
      })
      .select('id, name, category, price, created_at')
      .single()

    if (error) {
      const dbMessage = String(error.message || '').trim()
      if (dbMessage) {
        return errorResponse(`Template submission failed: ${dbMessage}`, 500)
      }
      return errorResponse('Template submission failed due to a database error', 500)
    }

    return successResponse(
      {
        message: 'Template submitted successfully. It is pending review before going live.',
        template: data,
      },
      201
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}
