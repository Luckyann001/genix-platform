import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function normalizeNextPath(rawNext: string | null): string {
  if (!rawNext) return '/templates'
  return rawNext.startsWith('/') ? rawNext : '/templates'
}

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const { searchParams } = new URL(request.url)
  const next = normalizeNextPath(searchParams.get('next'))
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${appUrl}/api/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    return NextResponse.redirect(`${appUrl}/login?error=auth_failed`)
  }

  return NextResponse.redirect(data.url)
}
