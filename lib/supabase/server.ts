import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

// Server URL should be public; keys must be server-side when performing privileged actions.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Prefer a service role / private key for server operations. Fall back to anon key if explicitly provided.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PRIVATE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

declare global {
  // allow storing the client on globalThis in Node to reuse between imports
  // eslint-disable-next-line no-var
  var __supabase_client: SupabaseClient | undefined
}

let supabaseClient: SupabaseClient | undefined = (globalThis as any).__supabase_client

export function createClient(): SupabaseClient {
  if (supabaseClient) return supabaseClient
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set.')
  }
  supabaseClient = createSupabaseClient(supabaseUrl, supabaseServiceKey)
  ;(globalThis as any).__supabase_client = supabaseClient
  return supabaseClient
}
