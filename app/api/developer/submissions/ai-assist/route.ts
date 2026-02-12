import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSubmissionAids } from '@/lib/llm'
import { serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json()
    const context = {
      repoUrl: body?.repoUrl,
      templateName: body?.templateName,
      category: body?.category,
      notes: body?.notes,
      features: body?.features,
    }

    const result = await generateSubmissionAids(context)
    return successResponse({ suggestion: result })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
