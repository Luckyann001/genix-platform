import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-paystack-signature')
  
  // Verify webhook signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex')
  
  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  const event = JSON.parse(body)
  const supabase = createClient()
  
  // Handle charge.success event
  if (event.event === 'charge.success') {
    const { reference, metadata, amount } = event.data
    const purchaseId = metadata?.purchaseId
    const templateId = metadata?.templateId
    const buyerId = metadata?.buyerId
    const consultationId = metadata?.consultationId
    const paymentType = String(metadata?.paymentType || metadata?.payment_type || '')

    // Consultation payment success
    if (consultationId || paymentType === 'consultation') {
      const { data: consultation } = await supabase
        .from('consultations')
        .select('id, status, buyer_id, developer_id, amount')
        .eq('id', consultationId)
        .single()

      if (!consultation) {
        return NextResponse.json({ error: 'Consultation not found' }, { status: 404 })
      }

      if (consultation.status !== 'scheduled' && consultation.status !== 'completed') {
        await supabase
          .from('consultations')
          .update({
            status: 'scheduled',
            payment_reference: reference,
          })
          .eq('id', consultation.id)
      }

      await supabase.from('notifications').insert([
        {
          user_id: consultation.buyer_id,
          type: 'consultation_confirmed',
          title: 'Consultation Confirmed',
          message: 'Your consultation booking is confirmed.',
          related_consultation_id: consultation.id,
          action_url: `/dashboard/consultations`,
        },
        {
          user_id: consultation.developer_id,
          type: 'consultation_booked',
          title: 'New Consultation Booking',
          message: `You have a new paid consultation booking (₦${Number(consultation.amount || amount || 0).toLocaleString()}).`,
          related_consultation_id: consultation.id,
          action_url: `/dashboard/consultations`,
        },
      ])

      return NextResponse.json({ received: true })
    }

    // Template purchase payment success
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id, status')
      .eq('id', purchaseId)
      .single()

    if (!purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    if (purchase.status === 'completed') {
      return NextResponse.json({ received: true })
    }

    await supabase
      .from('purchases')
      .update({
        status: 'completed',
        payment_reference: reference,
      })
      .eq('id', purchaseId)

    await supabase.rpc('increment_template_purchases', {
      template_uuid: templateId
    })

    const { data: template } = await supabase
      .from('templates')
      .select('name, developer_id, price')
      .eq('id', templateId)
      .single()

    if (!template || !template.name || !template.developer_id) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    await supabase.from('notifications').insert({
      user_id: buyerId,
      type: 'purchase_confirmed',
      title: 'Purchase Complete!',
      message: `You now own ${template.name}. Start customizing!`,
      related_template_id: templateId,
      related_purchase_id: purchaseId,
      action_url: `/customize/${templateId}?purchase=${purchaseId}`
    })

    const developerEarnings = Math.round(amount * 0.70 / 100) // 70% in naira
    await supabase.from('notifications').insert({
      user_id: template.developer_id,
      type: 'template_sold',
      title: '💰 Template Sold!',
      message: `Your template "${template.name}" was purchased. You earned ₦${developerEarnings}`,
      related_template_id: templateId,
      related_purchase_id: purchaseId,
      action_url: `/dashboard/sales`
    })
  }
  
  return NextResponse.json({ received: true })
}
