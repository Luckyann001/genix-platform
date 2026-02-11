import { createClient } from '@/lib/supabase/server'
import { initializePayment, calculateFees } from '@/lib/paystack'
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorizedResponse()
  
  try {
    const { templateId } = await request.json()
    
    // Get template
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*, developer:profiles!templates_developer_id_fkey(id)')
      .eq('id', templateId)
      .single()
    
    if (templateError || !template) {
      return errorResponse('Template not found', 404)
    }
    
    // Check if already purchased
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('template_id', templateId)
      .single()
    
    if (existingPurchase) {
      return errorResponse('You already own this template', 400)
    }
    
    // Calculate fees
    const fees = calculateFees(template.price)
    
    // Create pending purchase
    const { data: purchase } = await supabase
      .from('purchases')
      .insert({
        buyer_id: user.id,
        seller_id: template.developer_id,
        template_id: templateId,
        price: template.price,
        platform_fee: fees.platformFee,
        developer_earnings: fees.developerEarnings,
        status: 'pending'
      })
      .select()
      .single()
    
    // Initialize Paystack payment
    const payment = await initializePayment(
      user.email!,
      template.price,
      {
        purchaseId: purchase.id,
        templateId: templateId,
        buyerId: user.id,
      }
    )
    
    return successResponse({
      authorizationUrl: payment.authorization_url,
      reference: payment.reference,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return errorResponse('Failed to create checkout session')
  }
}