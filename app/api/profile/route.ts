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
      avatar_url,
      bank_name,
      bank_account_number,
      bank_account_name,
      paystack_recipient_code,
      recipient_code,
      bank_recipient_code,
      transfer_recipient_code
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
    if (bank_name !== undefined) updateData.bank_name = bank_name
    if (bank_account_number !== undefined) updateData.bank_account_number = bank_account_number
    if (bank_account_name !== undefined) updateData.bank_account_name = bank_account_name
    if (paystack_recipient_code !== undefined) updateData.paystack_recipient_code = paystack_recipient_code
    if (recipient_code !== undefined) updateData.recipient_code = recipient_code
    if (bank_recipient_code !== undefined) updateData.bank_recipient_code = bank_recipient_code
    if (transfer_recipient_code !== undefined) updateData.transfer_recipient_code = transfer_recipient_code
    
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
