import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/admin-auth'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'
import { initiateRefund } from '@/lib/paystack'

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

    const { data: refund, error: refundError } = await supabase
      .from('refund_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (refundError || !refund) return errorResponse('Refund request not found', 404)
    if (refund.status !== 'pending') return errorResponse('Refund request is no longer pending')

    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('id, payment_reference, price, refund_status')
      .eq('id', refund.purchase_id)
      .single()

    if (purchaseError || !purchase) return errorResponse('Purchase not found', 404)
    if (!purchase.payment_reference) return errorResponse('Cannot process refund without payment reference')

    const refundExecution = await initiateRefund(
      String(purchase.payment_reference),
      Number(refund.amount || purchase.price || 0),
      note || 'Refund approved by admin'
    )

    const now = new Date().toISOString()

    const { error: updateRefundError } = await supabase
      .from('refund_requests')
      .update({
        status: 'approved',
        admin_note: note || null,
        resolved_at: now,
        resolved_by: user.id,
        paystack_refund_reference: refundExecution?.transaction_reference || refundExecution?.reference || null,
        paystack_refund_response: refundExecution || null,
      })
      .eq('id', id)

    if (updateRefundError) throw updateRefundError

    const { error: updatePurchaseError } = await supabase
      .from('purchases')
      .update({
        status: 'refunded',
        refund_status: 'approved',
        refunded_at: now,
        refund_amount: refund.amount,
        refund_reason: refund.reason,
      })
      .eq('id', refund.purchase_id)

    if (updatePurchaseError) throw updatePurchaseError

    await supabase.from('notifications').insert([
      {
        user_id: refund.buyer_id,
        type: 'refund_approved',
        title: 'Refund Approved',
        message: 'Your refund request has been approved.',
        related_purchase_id: refund.purchase_id,
        action_url: '/refunds',
      },
      {
        user_id: refund.seller_id,
        type: 'refund_approved',
        title: 'Refund Processed',
        message: 'A refund request on one of your sales has been approved.',
        related_purchase_id: refund.purchase_id,
        action_url: '/developer/earnings',
      },
    ])

    return successResponse({ message: 'Refund approved successfully' })
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('refund_requests')) {
      return errorResponse('Missing refund_requests table. Run the latest migration.', 500)
    }
    return serverErrorResponse(error)
  }
}
