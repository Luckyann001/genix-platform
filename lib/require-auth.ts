import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireAuth(nextPath: string) {
  const supabase = createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  }

  return user
}
