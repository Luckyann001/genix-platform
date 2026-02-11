const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY)

export const paystack = Paystack

// Initialize transaction
export async function initializePayment(email: string, amount: number, metadata: any) {
  try {
    const response = await paystack.transaction.initialize({
      email,
      amount: amount * 100, // Paystack uses kobo/cents
      metadata,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/callback`,
    })
    
    return response.data
  } catch (error) {
    console.error('Paystack initialization error:', error)
    throw error
  }
}

// Verify transaction
export async function verifyPayment(reference: string) {
  try {
    const response = await paystack.transaction.verify(reference)
    return response.data
  } catch (error) {
    console.error('Paystack verification error:', error)
    throw error
  }
}

// Calculate fees (30% platform fee)
export function calculateFees(amount: number) {
  const platformFee = Math.round(amount * 0.30)
  const developerEarnings = amount - platformFee
  
  return {
    total: amount,
    platformFee,
    developerEarnings,
  }
}

// Format price for display
export function formatPrice(amount: number, currency: string = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
  }).format(amount / 100)
}