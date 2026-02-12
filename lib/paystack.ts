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

// Initiate a Paystack refund for a successful transaction.
export async function initiateRefund(reference: string, amount: number, note?: string) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY
    if (!secret) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured')
    }

    const response = await fetch('https://api.paystack.co/refund', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction: reference,
        amount: Math.round(amount * 100), // kobo
        customer_note: note || undefined,
        merchant_note: note || undefined,
      }),
    })

    const payload = await response.json()

    if (!response.ok || payload?.status === false) {
      throw new Error(payload?.message || `Paystack refund failed with status ${response.status}`)
    }

    return payload?.data
  } catch (error) {
    console.error('Paystack refund error:', error)
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

// Template sales: 30% platform, 70% developer
export function calculateTemplateFees(amount: number) {
  const platformFee = Math.round(amount * 0.30)
  const developerEarnings = amount - platformFee
  
  return {
    total: amount,
    platformFee,        // You keep this
    developerEarnings,  // Transfer to developer
  }
}

// Consultations: 15% platform, 85% developer
export function calculateConsultationFees(amount: number) {
  const platformFee = Math.round(amount * 0.15)
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
