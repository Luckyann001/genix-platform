import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/admin-auth'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'
import { generateTemplateModerationSuggestion } from '@/lib/llm'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()
  if (!isAdminUser(user)) return unauthorizedResponse('Admin access required')

  try {
    const { data: template, error } = await supabase
      .from('templates')
      .select('id, name, description, category, price, demo_url')
      .eq('id', id)
      .single()

    if (error || !template) return errorResponse('Template not found', 404)

    const suggestion = await generateTemplateModerationSuggestion({
      name: String(template.name || ''),
      category: String(template.category || ''),
      price: Number(template.price || 0),
      description: String(template.description || ''),
      demoUrl: String(template.demo_url || ''),
    })

    return successResponse({ template_id: id, suggestion })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
