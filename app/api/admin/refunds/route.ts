import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/admin-auth'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()
  if (!isAdminUser(user)) return unauthorizedResponse('Admin access required')

  try {
    const { searchParams } = new URL(request.url)
    const status = String(searchParams.get('status') || 'pending').toLowerCase()

    let query = supabase
      .from('refund_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) throw error

    return successResponse({ refunds: data || [], status })
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('refund_requests')) {
      return errorResponse('Missing refund_requests table. Run the latest migration.', 500)
    }
    return serverErrorResponse(error)
  }
}
