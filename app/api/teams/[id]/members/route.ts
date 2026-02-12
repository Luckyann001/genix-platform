import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

async function canManageTeam(supabase: ReturnType<typeof createClient>, teamId: string, userId: string) {
  const { data } = await supabase
    .from('team_members')
    .select('role')
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .single()

  return data?.role === 'owner' || data?.role === 'admin'
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { data: membership } = await supabase
      .from('team_members')
      .select('id')
      .eq('team_id', id)
      .eq('user_id', user.id)
      .single()

    if (!membership) return errorResponse('Unauthorized', 403)

    const { data, error } = await supabase
      .from('team_members')
      .select('id, user_id, role, invited_by, joined_at')
      .eq('team_id', id)
      .order('joined_at', { ascending: true })

    if (error) throw error

    return successResponse({ members: data || [] })
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('team_members')) {
      return errorResponse('Missing team tables. Run the MVP phase migration first.', 500)
    }
    return serverErrorResponse(error)
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const allowed = await canManageTeam(supabase, id, user.id)
    if (!allowed) return errorResponse('Only owners/admins can add members', 403)

    const body = await request.json()
    const memberUserId = String(body?.userId || '').trim()
    const role = String(body?.role || 'editor').trim().toLowerCase()

    if (!memberUserId) return errorResponse('userId is required')
    if (!['owner', 'admin', 'editor', 'viewer'].includes(role)) return errorResponse('Invalid role')

    const { data, error } = await supabase
      .from('team_members')
      .insert({
        team_id: id,
        user_id: memberUserId,
        role,
        invited_by: user.id,
      })
      .select('*')
      .single()

    if (error) throw error

    return successResponse({ member: data }, 201)
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('team_members')) {
      return errorResponse('Missing team tables. Run the MVP phase migration first.', 500)
    }
    return serverErrorResponse(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const allowed = await canManageTeam(supabase, id, user.id)
    if (!allowed) return errorResponse('Only owners/admins can remove members', 403)

    const { searchParams } = new URL(request.url)
    const memberUserId = String(searchParams.get('userId') || '').trim()
    if (!memberUserId) return errorResponse('userId is required')

    const { error } = await supabase.from('team_members').delete().eq('team_id', id).eq('user_id', memberUserId)
    if (error) throw error

    return successResponse({ removed: true })
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('team_members')) {
      return errorResponse('Missing team tables. Run the MVP phase migration first.', 500)
    }
    return serverErrorResponse(error)
  }
}
