import { createClient } from '@/lib/supabase/server'
import { isAdminUser } from '@/lib/admin-auth'
import { HeaderClient } from '@/components/layout/HeaderClient'

export async function Header() {
  const supabase = createClient()
  const { data: authData } = await supabase.auth.getUser()
  const showAdmin = isAdminUser(authData.user)

  return <HeaderClient showAdmin={showAdmin} />
}
