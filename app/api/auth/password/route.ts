import { NextRequest } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

function normalizeNextPath(rawNext: unknown): string {
  const value = String(rawNext || '')
  if (!value) return '/templates'
  return value.startsWith('/') ? value : '/templates'
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  try {
    const body = await request.json()
    const mode = String(body?.mode || '').toLowerCase()
    const next = normalizeNextPath(body?.next)
    const name = String(body?.name || '').trim()
    const email = String(body?.email || '').trim().toLowerCase()
    const password = String(body?.password || '')

    if (mode !== 'signup' && mode !== 'signin') {
      return errorResponse('Invalid auth mode')
    }
    if (!email || !password) {
      return errorResponse('Email and password are required')
    }
    if (mode === 'signup' && !name) {
      return errorResponse('Name is required')
    }

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name,
          },
        },
      })

      if (error) return errorResponse(error.message)

      const user = data.user
      if (!user?.id) return unauthorizedResponse('Account creation failed')

      try {
        const adminSupabase = createAdminClient()
        await adminSupabase
          .from('profiles')
          .upsert(
            {
              id: user.id,
              email: user.email || email,
              full_name: name || user.user_metadata?.full_name || user.user_metadata?.name || null,
              avatar_url: user.user_metadata?.avatar_url || null,
              user_type: 'buyer',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          )
      } catch (profileError) {
        console.error('Password signup profile sync failed:', profileError)
      }

      return successResponse(
        {
          requiresEmailVerification: !data.session,
          next: data.session ? next : null,
        },
        201
      )
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return errorResponse(error.message, 401)

    return successResponse({ next })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
