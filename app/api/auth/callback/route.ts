import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

function normalizeRole(raw: string | null): 'developer' | 'buyer' {
  if (String(raw || '').toLowerCase() === 'developer') return 'developer'
  return 'buyer'
}

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  const requestUrl = new URL(request.url)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin
  const code = requestUrl.searchParams.get('code')
  const role = normalizeRole(requestUrl.searchParams.get('role'))
  const rawNext = requestUrl.searchParams.get('next')
  const defaultNext = role === 'developer' ? '/developer' : '/templates'
  const next = rawNext && rawNext.startsWith('/') ? rawNext : defaultNext

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=missing_oauth_code`)
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${appUrl}/login?error=oauth_callback_failed`)
  }

  // Keep profile role aligned with auth entrypoint choice.
  try {
    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user

    if (user?.id) {
      const adminSupabase = createAdminClient()
      await adminSupabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            email: user.email || null,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            user_type: role,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
    }
  } catch (profileError) {
    console.error('OAuth callback profile sync failed:', profileError)
  }

  return NextResponse.redirect(`${appUrl}${next}`)
}
