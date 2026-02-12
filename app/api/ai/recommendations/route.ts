import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { serverErrorResponse, successResponse } from '@/lib/api-response'

function normalizeCategory(value: unknown): string {
  return String(value || '').trim().toLowerCase()
}

export async function GET(request: NextRequest) {
  const supabase = createClient()

  try {
    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user

    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('id, name, category, price, preview_data, created_at')
      .order('created_at', { ascending: false })
      .limit(80)

    if (templatesError) throw templatesError

    const visible = (templates || []).filter((template: any) => {
      const previewData = template.preview_data && typeof template.preview_data === 'object' ? template.preview_data : {}
      return String(previewData.review_status || 'approved') === 'approved'
    })

    if (!user) {
      return successResponse({
        source: 'popular',
        recommendations: visible.slice(0, 6),
      })
    }

    const { data: purchases } = await supabase
      .from('purchases')
      .select('template_id')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)

    const boughtIds = new Set((purchases || []).map((p: any) => String(p.template_id)))
    const boughtTemplates = visible.filter((template: any) => boughtIds.has(String(template.id)))

    const categoryScores = new Map<string, number>()
    for (const template of boughtTemplates) {
      const category = normalizeCategory(template.category)
      if (!category) continue
      categoryScores.set(category, (categoryScores.get(category) || 0) + 1)
    }

    const scored = visible
      .filter((template: any) => !boughtIds.has(String(template.id)))
      .map((template: any) => ({
        ...template,
        _score: (categoryScores.get(normalizeCategory(template.category)) || 0) + 1,
      }))
      .sort((a: any, b: any) => b._score - a._score)

    return successResponse({
      source: categoryScores.size > 0 ? 'behavior' : 'popular',
      recommendations: scored.slice(0, 6).map(({ _score, ...rest }: any) => rest),
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
