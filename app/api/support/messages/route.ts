import { createClient } from '@/lib/supabase/server'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorizedResponse()
  
  try {
    const { ticketId, message, attachments } = await request.json()
    
    if (!ticketId || !message) {
      return errorResponse('Ticket ID and message are required')
    }
    
    // Verify user has access to ticket
    const { data: ticket } = await supabase
      .from('support_tickets')
      .select('buyer_id, developer_id')
      .eq('id', ticketId)
      .single()
    
    if (!ticket) {
      return errorResponse('Ticket not found', 404)
    }
    
    if (ticket.buyer_id !== user.id && ticket.developer_id !== user.id) {
      return errorResponse('Unauthorized', 403)
    }
    
    const { data, error } = await supabase
      .from('support_messages')
      .insert({
        ticket_id: ticketId,
        sender_id: user.id,
        message,
        attachments: attachments || []
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Notify the other party
    const recipientId = ticket.buyer_id === user.id ? ticket.developer_id : ticket.buyer_id
    
    await supabase.from('notifications').insert({
      user_id: recipientId,
      type: 'support_message_received',
      title: 'New Support Message',
      message: 'You have a new message on your support ticket',
      related_ticket_id: ticketId,
      action_url: `/support/tickets/${ticketId}`
    })
    
    return successResponse(data, 201)
  } catch (error) {
    return serverErrorResponse(error)
  }
}
