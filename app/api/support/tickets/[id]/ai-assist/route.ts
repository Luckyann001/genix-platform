import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'
import { generateSupportReplySuggestion } from '@/lib/llm'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { data: ticket } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('id', id)
      .single()

    if (!ticket) return errorResponse('Ticket not found', 404)
    if (ticket.buyer_id !== user.id && ticket.developer_id !== user.id) {
      return errorResponse('Unauthorized', 403)
    }

    const { data: messages } = await supabase
      .from('support_messages')
      .select('id, sender_id, message, created_at')
      .eq('ticket_id', id)
      .order('created_at', { ascending: false })
      .limit(10)

    const suggestion = await generateSupportReplySuggestion(ticket, messages || [])
    return successResponse({ ticket_id: id, suggestion })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
