import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorizedResponse()
  
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (error) throw error
    
    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
