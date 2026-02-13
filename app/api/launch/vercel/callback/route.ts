import { createAdminClient, createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function decodeState(raw: string | null): { userId: string; purchaseId: string } | null {
  try {
    const value = JSON.parse(Buffer.from(String(raw || ''), 'base64url').toString('utf8'))
    if (!value?.userId || !value?.purchaseId) return null
    return {
      userId: String(value.userId),
      purchaseId: String(value.purchaseId),
    }
  } catch (_error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  const code = String(request.nextUrl.searchParams.get('code') || '').trim()
  const state = decodeState(request.nextUrl.searchParams.get('state'))
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/templates?error=invalid_vercel_callback`)
  }

  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user || user.id !== state.userId) {
    return NextResponse.redirect(`${appUrl}/login?next=${encodeURIComponent(`/launch/${state.purchaseId}`)}`)
  }

  const clientId = process.env.VERCEL_CLIENT_ID
  const clientSecret = process.env.VERCEL_CLIENT_SECRET
  const redirectUri = `${appUrl}/api/launch/vercel/callback`

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/launch/${state.purchaseId}?error=missing_vercel_oauth_env`)
  }

  try {
    const tokenResponse = await fetch('https://api.vercel.com/v2/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    })

    const tokenPayload = await tokenResponse.json().catch(() => ({}))
    if (!tokenResponse.ok || !tokenPayload?.access_token) {
      return NextResponse.redirect(`${appUrl}/launch/${state.purchaseId}?error=vercel_token_exchange_failed`)
    }

    await adminSupabase
      .from('buyer_hosting_connections')
      .upsert(
        {
          buyer_id: user.id,
          provider: 'vercel',
          access_token: String(tokenPayload.access_token),
          provider_account_id: String(tokenPayload.user_id || ''),
          metadata: {
            scope: tokenPayload.scope || null,
            token_type: tokenPayload.token_type || null,
          },
          connected_at: new Date().toISOString(),
        },
        { onConflict: 'buyer_id,provider' }
      )

    return NextResponse.redirect(`${appUrl}/launch/${state.purchaseId}?connected=1`)
  } catch (_error) {
    return NextResponse.redirect(`${appUrl}/launch/${state.purchaseId}?error=vercel_connect_failed`)
  }
}
