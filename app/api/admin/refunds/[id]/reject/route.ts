import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/admin-auth'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()
  if (!isAdminUser(user)) return unauthorizedResponse('Admin access required')

  try {
    const body = await request.json().catch(() => ({}))
    const note = String(body?.note || '').trim()

    if (!note) {
      return errorResponse('Rejection note is required')
    }

    const { data: refund, error: refundError } = await supabase
      .from('refund_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (refundError || !refund) return errorResponse('Refund request not found', 404)
    if (refund.status !== 'pending') return errorResponse('Refund request is no longer pending')

    const now = new Date().toISOString()

    const { error: updateRefundError } = await supabase
      .from('refund_requests')
      .update({
        status: 'rejected',
        admin_note: note,
        resolved_at: now,
        resolved_by: user.id,
      })
      .eq('id', id)

    if (updateRefundError) throw updateRefundError

    await supabase
      .from('purchases')
      .update({
        refund_status: 'rejected',
      })
      .eq('id', refund.purchase_id)

    await supabase.from('notifications').insert({
      user_id: refund.buyer_id,
      type: 'refund_rejected',
      title: 'Refund Request Rejected',
      message: 'Your refund request was rejected. Check admin note for details.',
      related_purchase_id: refund.purchase_id,
      action_url: '/refunds',
    })

    return successResponse({ message: 'Refund rejected successfully' })
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('refund_requests')) {
      return errorResponse('Missing refund_requests table. Run the latest migration.', 500)
    }
    return serverErrorResponse(error)
  }
}
