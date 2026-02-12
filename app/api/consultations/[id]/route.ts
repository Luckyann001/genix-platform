import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, notFoundResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { data, error } = await supabase.from('consultations').select('*').eq('id', id).single()

    if (error) throw error
    if (!data) return notFoundResponse('Consultation')
    if (data.buyer_id !== user.id && data.developer_id !== user.id) return errorResponse('Unauthorized', 403)

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json()
    const status = String(body?.status || '').trim().toLowerCase()
    const allowed = ['scheduled', 'completed', 'cancelled']
    if (!allowed.includes(status)) return errorResponse('Invalid status')

    const { data: existing, error: readError } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', id)
      .single()

    if (readError) throw readError
    if (!existing) return notFoundResponse('Consultation')
    if (existing.buyer_id !== user.id && existing.developer_id !== user.id) return errorResponse('Unauthorized', 403)

    const updatePayload: Record<string, any> = { status }
    if (status === 'completed') {
      updatePayload.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('consultations')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error

    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
