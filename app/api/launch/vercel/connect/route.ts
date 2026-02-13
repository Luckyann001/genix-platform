import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function encodeState(value: Record<string, string>) {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?next=${encodeURIComponent(request.nextUrl.pathname)}`)
  }

  const purchaseId = String(request.nextUrl.searchParams.get('purchaseId') || '').trim()
  if (!purchaseId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/templates?error=missing_purchase`)
  }

  const clientId = process.env.VERCEL_CLIENT_ID
  if (!clientId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/launch/${purchaseId}?error=missing_vercel_client_id`)
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/launch/vercel/callback`
  const state = encodeState({
    userId: user.id,
    purchaseId,
  })

  const url = new URL('https://vercel.com/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'user')
  url.searchParams.set('state', state)

  return NextResponse.redirect(url.toString())
}
