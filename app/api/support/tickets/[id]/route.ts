import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, serverErrorResponse } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorizedResponse()
  
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        template:templates(name, slug),
        buyer:profiles!support_tickets_buyer_id_fkey(username, full_name, avatar_url, email),
        developer:profiles!support_tickets_developer_id_fkey(username, full_name, avatar_url, email)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    if (!data) return notFoundResponse('Support ticket')
    
    // Check authorization
    if (data.buyer_id !== user.id && data.developer_id !== user.id) {
      return errorResponse('Unauthorized', 403)
    }
    
    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorizedResponse()
  
  try {
    const { status } = await request.json()
    
    const validStatuses = ['open', 'in_progress', 'waiting_response', 'resolved', 'closed']
    if (!validStatuses.includes(status)) {
      return errorResponse('Invalid status')
    }
    
    const { data, error } = await supabase
      .from('support_tickets')
      .update({ status })
      .eq('id', id)
      .or(`buyer_id.eq.${user.id},developer_id.eq.${user.id}`)
      .select()
      .single()
    
    if (error) throw error
    
    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
