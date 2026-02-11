import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorizedResponse()
  
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        template:templates(name, slug),
        buyer:profiles!support_tickets_buyer_id_fkey(username, full_name, avatar_url),
        developer:profiles!support_tickets_developer_id_fkey(username, full_name, avatar_url)
      `)
      .or(`buyer_id.eq.${user.id},developer_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorizedResponse()
  
  try {
    const { purchaseId, subject, description, priority } = await request.json()
    
    if (!purchaseId || !subject || !description) {
      return errorResponse('Purchase ID, subject, and description are required')
    }
    
    // Verify purchase ownership
    const { data: purchase } = await supabase
      .from('purchases')
      .select('template_id, seller_id, buyer_id')
      .eq('id', purchaseId)
      .eq('buyer_id', user.id)
      .single()
    
    if (!purchase) {
      return errorResponse('Purchase not found or unauthorized', 403)
    }
    
    const { data, error} = await supabase
      .from('support_tickets')
      .insert({
        purchase_id: purchaseId,
        template_id: purchase.template_id,
        buyer_id: user.id,
        developer_id: purchase.seller_id,
        subject,
        description,
        priority: priority || 'medium',
        status: 'open'
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Notify developer
    await supabase.from('notifications').insert({
      user_id: purchase.seller_id,
      type: 'support_ticket_created',
      title: 'New Support Ticket',
      message: subject,
      related_ticket_id: data.id,
      action_url: `/support/tickets/${data.id}`
    })
    
    return successResponse(data, 201)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
