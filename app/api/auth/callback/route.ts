import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const requestUrl = new URL(request.url)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin
  const code = requestUrl.searchParams.get('code')
  const rawNext = requestUrl.searchParams.get('next')
  const next = rawNext && rawNext.startsWith('/') ? rawNext : '/templates'

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=missing_oauth_code`)
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${appUrl}/login?error=oauth_callback_failed`)
  }

  return NextResponse.redirect(`${appUrl}${next}`)
}
