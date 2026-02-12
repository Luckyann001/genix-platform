import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/admin-auth'

export async function requireAdmin(nextPath: string) {
  const supabase = createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  }

  if (!isAdminUser(user)) {
    redirect('/templates')
  }

  return user
}
