import type { User } from '@supabase/supabase-js'

function normalizeList(raw: string | undefined): string[] {
  if (!raw) return []
  return raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false

  const email = String(user.email || '').toLowerCase()
  if (!email) return false

  const allowed = normalizeList(process.env.ADMIN_EMAILS)
  if (allowed.length === 0) {
    return false
  }

  return allowed.includes(email)
}
