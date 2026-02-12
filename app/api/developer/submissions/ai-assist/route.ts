import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSubmissionAids } from '@/lib/llm'
import { serverErrorResponse, successResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
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
