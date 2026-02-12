import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/admin-auth'
import { serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()
  if (!isAdminUser(user)) return unauthorizedResponse('Admin access required')

  try {
    const [purchasesResult, consultationsResult, payoutsResult, templatesResult] = await Promise.all([
      supabase.from('purchases').select('price, platform_fee, developer_earnings, status'),
      supabase.from('consultations').select('amount, platform_fee, developer_earnings, status'),
      supabase.from('payout_transfers').select('amount, status'),
      supabase.from('templates').select('id, preview_data'),
    ])

    if (purchasesResult.error) throw purchasesResult.error
    if (consultationsResult.error) throw consultationsResult.error
    if (payoutsResult.error) throw payoutsResult.error
    if (templatesResult.error) throw templatesResult.error

    const purchases = purchasesResult.data || []
    const consultations = consultationsResult.data || []
    const payouts = payoutsResult.data || []
    const templates = templatesResult.data || []

    const purchaseRevenue = purchases.reduce((sum: number, row: any) => sum + Number(row.price || 0), 0)
    const purchasePlatformFees = purchases.reduce((sum: number, row: any) => sum + Number(row.platform_fee || 0), 0)

    const consultationRevenue = consultations.reduce((sum: number, row: any) => sum + Number(row.amount || 0), 0)
    const consultationPlatformFees = consultations.reduce((sum: number, row: any) => sum + Number(row.platform_fee || 0), 0)

    const payoutsPaid = payouts
      .filter((row: any) => row.status === 'paid')
      .reduce((sum: number, row: any) => sum + Number(row.amount || 0), 0)

    const pendingReviews = templates.filter((row: any) => {
      const previewData = row.preview_data && typeof row.preview_data === 'object' ? row.preview_data : {}
      return String(previewData.review_status || 'pending') === 'pending'
    }).length

    return successResponse({
      purchases: {
        total_orders: purchases.length,
        gross_revenue: purchaseRevenue,
        platform_fees: purchasePlatformFees,
      },
      consultations: {
        total_bookings: consultations.length,
        gross_revenue: consultationRevenue,
        platform_fees: consultationPlatformFees,
      },
      payouts: {
        total_entries: payouts.length,
        paid_amount: payoutsPaid,
      },
      moderation: {
        pending_reviews: pendingReviews,
      },
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
