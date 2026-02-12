import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateConsultationFees, initializePayment } from '@/lib/paystack'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .or(`buyer_id.eq.${user.id},developer_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (error) throw error

    return successResponse({ consultations: data || [] })
  } catch (error) {
    return serverErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json()

    const developerId = String(body?.developerId || '').trim()
    const templateId = body?.templateId ? String(body.templateId) : null
    const title = String(body?.title || 'Consultation Session').trim()
    const notes = String(body?.notes || '').trim()
    const scheduledFor = String(body?.scheduledFor || '').trim()
    const durationMinutes = Number(body?.durationMinutes || 60)
    const amount = Number(body?.amount || 0)

    if (!developerId || !scheduledFor || Number.isNaN(amount) || amount <= 0) {
      return errorResponse('developerId, scheduledFor, and amount are required')
    }

    if (developerId === user.id) {
      return errorResponse('You cannot book a consultation with yourself')
    }

    const fees = calculateConsultationFees(Math.round(amount))

    const { data: consultation, error: insertError } = await supabase
      .from('consultations')
      .insert({
        buyer_id: user.id,
        developer_id: developerId,
        template_id: templateId,
        title,
        notes: notes || null,
        scheduled_for: scheduledFor,
        duration_minutes: Number.isNaN(durationMinutes) || durationMinutes < 15 ? 60 : durationMinutes,
        amount: fees.total,
        platform_fee: fees.platformFee,
        developer_earnings: fees.developerEarnings,
        status: 'pending_payment',
        payout_status: 'pending',
        metadata: {
          payment_type: 'consultation',
        },
      })
      .select('*')
      .single()

    if (insertError) throw insertError

    const payment = await initializePayment(user.email!, fees.total, {
      consultationId: consultation.id,
      developerId,
      buyerId: user.id,
      paymentType: 'consultation',
    })

    return successResponse(
      {
        consultation,
        payment: {
          authorizationUrl: payment.authorization_url,
          reference: payment.reference,
        },
      },
      201
    )
  } catch (error) {
    return serverErrorResponse(error)
  }
}
