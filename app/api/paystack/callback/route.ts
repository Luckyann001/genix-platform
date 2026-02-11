import { createClient } from '@/lib/supabase/server'
import { verifyPayment } from '@/lib/paystack'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reference = searchParams.get('reference')
  
  if (!reference) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/templates?error=no_reference`)
  }
  
  try {
    // Verify payment
    const payment = await verifyPayment(reference)
    
    if (payment.status !== 'success') {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/templates?error=payment_failed`)
    }
    
    const { purchaseId, templateId } = payment.metadata
    
    // Update purchase status
    const supabase = createClient()
    await supabase
      .from('purchases')
      .update({ status: 'completed' })
      .eq('id', purchaseId)
    
    // Redirect to customization tool
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/customize/${templateId}?purchase=${purchaseId}`
    )
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/templates?error=verification_failed`)
  }
}
