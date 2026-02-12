import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()

  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('role, joined_at, team:team_workspaces(id, name, owner_id, created_at)')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false })

    if (error) throw error

    return successResponse({ teams: data || [] })
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('team_members')) {
      return errorResponse('Missing team tables. Run the MVP phase migration first.', 500)
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
    const name = String(body?.name || '').trim()

    if (!name) return errorResponse('Team name is required')

    const { data: team, error: teamError } = await supabase
      .from('team_workspaces')
      .insert({
        name,
        owner_id: user.id,
      })
      .select('*')
      .single()

    if (teamError) throw teamError

    const { error: memberError } = await supabase.from('team_members').insert({
      team_id: team.id,
      user_id: user.id,
      role: 'owner',
    })

    if (memberError) throw memberError

    return successResponse({ team }, 201)
  } catch (error: any) {
    if (String(error?.message || '').toLowerCase().includes('team_workspaces')) {
      return errorResponse('Missing team tables. Run the MVP phase migration first.', 500)
    }
    return serverErrorResponse(error)
  }
}
