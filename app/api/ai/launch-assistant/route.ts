import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateLaunchAssistantPlan } from '@/lib/llm'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json()

    const projectName = String(body?.projectName || '').trim()
    if (!projectName) return errorResponse('projectName is required')

    const context = {
      userId: user.id,
      projectName,
      businessType: body?.businessType || '',
      goals: body?.goals || '',
      templateName: body?.templateName || '',
      deploymentTarget: body?.deploymentTarget || 'vercel',
    }

    const result = await generateLaunchAssistantPlan(context)
    return successResponse({ plan: result })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
