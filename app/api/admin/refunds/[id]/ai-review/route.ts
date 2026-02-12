import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/admin-auth'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'
import { generateRefundReviewSuggestion } from '@/lib/llm'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()
  if (!isAdminUser(user)) return unauthorizedResponse('Admin access required')

  try {
    const { data: refund } = await supabase.from('refund_requests').select('*').eq('id', id).single()
    if (!refund) return errorResponse('Refund request not found', 404)

    const { data: purchase } = await supabase
      .from('purchases')
      .select('id, price, status, created_at, payment_reference, refund_status')
      .eq('id', refund.purchase_id)
      .single()

    const suggestion = await generateRefundReviewSuggestion(refund, purchase || {})
    return successResponse({ refund_id: id, suggestion })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
