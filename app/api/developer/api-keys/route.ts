import { randomBytes, createHash } from 'crypto'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

function hashKey(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function generateApiKey(): string {
  return `gnx_${randomBytes(24).toString('hex')}`
}

export async function GET() {
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { data, error } = await supabase
      .from('developer_api_keys')
      .select('id, name, key_prefix, scopes, last_used_at, expires_at, revoked_at, created_at')
      .eq('developer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return successResponse({ api_keys: data || [] })
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('developer_api_keys')) {
      return errorResponse('Missing developer_api_keys table. Run the MVP phase migration first.', 500)
    }
    return serverErrorResponse(error)
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const body = await request.json()

    const name = String(body?.name || '').trim() || 'Default key'
    const scopes = Array.isArray(body?.scopes) ? body.scopes.map((scope: unknown) => String(scope)) : ['read:templates']
    const expiresAt = body?.expiresAt ? String(body.expiresAt) : null

    const rawKey = generateApiKey()
    const keyHash = hashKey(rawKey)
    const keyPrefix = rawKey.slice(0, 10)

    const { data, error } = await supabase
      .from('developer_api_keys')
      .insert({
        developer_id: user.id,
        name,
        key_hash: keyHash,
        key_prefix: keyPrefix,
        scopes,
        expires_at: expiresAt,
      })
      .select('id, name, key_prefix, scopes, expires_at, created_at')
      .single()

    if (error) throw error

    return successResponse(
      {
        key: rawKey,
        api_key: data,
        message: 'Copy this key now. It will not be shown again.',
      },
      201
    )
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('developer_api_keys')) {
      return errorResponse('Missing developer_api_keys table. Run the MVP phase migration first.', 500)
    }
    return serverErrorResponse(error)
  }
}
