import { createClient } from '@/lib/supabase/server'
import { initializePayment, calculateTemplateFees } from '@/lib/paystack'
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorizedResponse()
  
  try {
    const body = await request.json()
    const templateId = String(body?.templateId || '')
    const exclusivePurchase = Boolean(body?.exclusivePurchase)
    const supportPackage = Boolean(body?.supportPackage)
    
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
      .maybeSingle()
    
    if (existingPurchase) {
      return errorResponse('You already own this template', 400)
    }
    
    if (exclusivePurchase && !template.exclusive_purchase_available) {
      return errorResponse('Exclusive purchase is not available for this template', 400)
    }

    if (supportPackage && !template.support_package_available) {
      return errorResponse('Support package is not available for this template', 400)
    }

    const basePrice = exclusivePurchase
      ? Number(template.exclusive_price || 0)
      : Number(template.price || 0)
    const supportPrice = supportPackage ? Number(template.support_package_price || 0) : 0
    const totalPrice = Math.round(basePrice + supportPrice)

    if (!totalPrice || totalPrice <= 0) {
      return errorResponse('Invalid purchase amount', 400)
    }

    // Calculate fees
    const fees = calculateTemplateFees(totalPrice)
    
    // Create pending purchase
    const { data: purchase } = await supabase
      .from('purchases')
      .insert({
        buyer_id: user.id,
        seller_id: template.developer_id,
        template_id: templateId,
        price: totalPrice,
        base_price: Math.round(basePrice),
        support_package: supportPackage,
        purchase_mode: exclusivePurchase ? 'exclusive' : 'standard',
        launch_status: 'onboarding',
        platform_fee: fees.platformFee,
        developer_earnings: fees.developerEarnings,
        status: 'pending'
      })
      .select()
      .single()
    
    // Initialize Paystack payment
    const payment = await initializePayment(
      user.email!,
      totalPrice,
      {
        purchaseId: purchase.id,
        templateId: templateId,
        buyerId: user.id,
        purchaseMode: exclusivePurchase ? 'exclusive' : 'standard',
        supportPackage,
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
