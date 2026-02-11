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
    const { reference, metadata, amount, customer } = event.data
    const { purchaseId, templateId, buyerId } = metadata
    
    // Update purchase
    await supabase
      .from('purchases')
      .update({
        status: 'completed',
        payment_reference: reference,
      })
      .eq('id', purchaseId)
    
    // Increment template purchase count
    await supabase.rpc('increment_template_purchases', {
      template_uuid: templateId
    })
    
    // Create notifications
    const { data: template } = await supabase
      .from('templates')
      .select('name, developer_id, price')
      .eq('id', templateId)
      .single()
    
    if (!template || !template.name || !template.developer_id) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }
    
    // Notify buyer
    await supabase.from('notifications').insert({
      user_id: buyerId,
      type: 'purchase_confirmed',
      title: 'Purchase Complete!',
      message: `You now own ${template.name}. Start customizing!`,
      related_template_id: templateId,
      related_purchase_id: purchaseId,
      action_url: `/customize/${templateId}?purchase=${purchaseId}`
    })
    
    // Notify developer
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