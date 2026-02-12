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
    const { data, error } = await supabase
      .from('refund_requests')
      .select('*')
      .eq('id', id)
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .single()

    if (error) throw error
    if (!data) return notFoundResponse('Refund request')

    return successResponse(data)
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('refund_requests')) {
      return errorResponse('Missing refund_requests table. Run the latest migration.', 500)
    }
    return serverErrorResponse(error)
  }
}
