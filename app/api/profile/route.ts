import { createClient } from '@/lib/supabase/server'
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function GET() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorizedResponse()
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) throw error
    
    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return unauthorizedResponse()
  
  try {
    const body = await request.json()
    const {
      username,
      full_name,
      bio,
      user_type,
      github_username,
      portfolio_url,
      company_name,
      avatar_url
    } = body
    
    const updateData: any = {}
    if (username) updateData.username = username
    if (full_name) updateData.full_name = full_name
    if (bio !== undefined) updateData.bio = bio
    if (user_type) updateData.user_type = user_type
    if (github_username !== undefined) updateData.github_username = github_username
    if (portfolio_url !== undefined) updateData.portfolio_url = portfolio_url
    if (company_name !== undefined) updateData.company_name = company_name
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()
    
    if (error) throw error
    
    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}

