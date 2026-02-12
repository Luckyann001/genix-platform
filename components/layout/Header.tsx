import { createClient } from '@/lib/supabase/server'
import { HeaderClient } from '@/components/layout/HeaderClient'

export async function Header() {
  const supabase = createClient()
  const { data: authData } = await supabase.auth.getUser()
  const userId = authData.user?.id
  const isSignedIn = Boolean(authData.user)
  let showDeveloperDashboard = false

  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userId)
      .single()

    showDeveloperDashboard = String(profile?.user_type || '').toLowerCase() === 'developer'
  }

  return <HeaderClient isSignedIn={isSignedIn} showDeveloperDashboard={showDeveloperDashboard} />
}
