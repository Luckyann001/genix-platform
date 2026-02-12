import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'
import { generateCustomizationPatch } from '@/lib/llm'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get('templateId')

    let query = supabase
      .from('ai_customizations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (templateId) {
      query = query.eq('template_id', templateId)
    }

    const { data, error } = await query
    if (error) throw error

    return successResponse({ customizations: data || [] })
  } catch (error) {
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

    const templateId = String(body?.templateId || '').trim()
    const prompt = String(body?.prompt || '').trim()
    const currentConfig = body?.currentConfig && typeof body.currentConfig === 'object' ? body.currentConfig : {}

    if (!templateId || !prompt) {
      return errorResponse('templateId and prompt are required')
    }

    let llmResult
    try {
      llmResult = await generateCustomizationPatch(prompt, currentConfig)
    } catch (llmError) {
      llmResult = {
        patch: {
          colors: {
            primary: '#0ea5e9',
            accent: '#10b981',
          },
          content: {
            hero_title: 'AI fallback customization copy',
          },
          sections: [],
        },
        provider: 'fallback_error',
      }
    }
    const generatedPatch = llmResult.patch

    const { data, error } = await supabase
      .from('ai_customizations')
      .insert({
        user_id: user.id,
        template_id: templateId,
        prompt,
        input_config: currentConfig,
        generated_patch: generatedPatch,
        status: 'generated',
        provider: llmResult.provider,
      })
      .select('*')
      .single()

    if (error) throw error

    return successResponse(
      {
        message: 'AI customization generated',
        customization: data,
      },
      201
    )
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('ai_customizations')) {
      return errorResponse('Missing ai_customizations table. Run the MVP phase migration first.', 500)
    }
    return serverErrorResponse(error)
  }
}
