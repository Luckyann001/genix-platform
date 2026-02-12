import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { data, error } = await supabase
      .from('developer_api_keys')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', id)
      .eq('developer_id', user.id)
      .is('revoked_at', null)
      .select('id, name, revoked_at')
      .single()

    if (error) throw error
    if (!data) return errorResponse('API key not found', 404)

    return successResponse({ api_key: data })
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('developer_api_keys')) {
      return errorResponse('Missing developer_api_keys table. Run the MVP phase migration first.', 500)
    }
    return serverErrorResponse(error)
  }
}
