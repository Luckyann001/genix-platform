import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireDeveloper(nextPath: string) {
  const supabase = createClient()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user

  if (!user) {
    redirect(`/api/auth/github?next=${encodeURIComponent(nextPath)}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .single()

  const userType = String(profile?.user_type || '').toLowerCase()
  if (userType !== 'developer') {
    redirect(`/api/auth/github?next=${encodeURIComponent(nextPath)}`)
  }

  return user
}
