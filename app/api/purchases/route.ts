import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        id,
        template_id,
        buyer_id,
        seller_id,
        price,
        platform_fee,
        developer_earnings,
        payment_reference,
        status,
        purchase_mode,
        support_package,
        base_price,
        launch_status,
        launch_live_url,
        launch_admin_url,
        launch_completed_at,
        refund_status,
        refunded_at,
        refund_amount,
        created_at,
        template:templates(id, name)
      `)
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return successResponse({ purchases: data || [] })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
