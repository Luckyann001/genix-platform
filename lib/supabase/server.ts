import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PRIVATE_KEY

// Cookie-aware client for app/router auth flows (required for auth.getUser()).
export function createClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.')
  }

  const cookieStore = cookies()
  // This client is used in both Route Handlers and Server Components.
  // Server Components cannot mutate cookies, so we guard set() to avoid runtime crashes
  // when Supabase attempts a token refresh during auth.getUser().
  const safeCookieStore = {
    get: (name: string) => cookieStore.get(name),
    set: (name: string, value: string, options?: Record<string, any>) => {
      try {
        cookieStore.set(name, value, options as any)
      } catch {
        // Ignore cookie writes in contexts where Next.js forbids mutation.
      }
    },
  } as any

  return createRouteHandlerClient({ cookies: () => safeCookieStore })
}

// Privileged client for trusted server-only operations (never expose this to the browser).
export function createAdminClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase admin environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_PRIVATE_KEY) are set.')
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey)
}
