import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse } from '@/lib/api-response'
import { generateDiscoverySuggestions } from '@/lib/llm'

export async function POST(request: NextRequest) {
  const supabase = createClient()

  try {
    const body = await request.json()
    const query = String(body?.query || '').trim()
    if (!query) return errorResponse('query is required')

    const { data: templates, error } = await supabase
      .from('templates')
      .select('id, name, category, price, description, demo_url, preview_data')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    const visible = (templates || []).filter((template: any) => {
      const previewData = template.preview_data && typeof template.preview_data === 'object' ? template.preview_data : {}
      const status = String(previewData.review_status || 'approved').toLowerCase()
      return status === 'approved'
    })

    const suggestion = await generateDiscoverySuggestions(query, visible, body?.signals || {})

    const ids = Array.isArray(suggestion?.result?.recommended_template_ids)
      ? suggestion.result.recommended_template_ids.map((value: any) => String(value))
      : []

    const recommended = visible.filter((template: any) => ids.includes(String(template.id)))

    return successResponse({
      suggestion,
      recommendations: recommended,
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
