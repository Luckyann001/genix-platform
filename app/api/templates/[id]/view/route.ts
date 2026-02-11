import { createClient } from '@/lib/supabase/server'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .rpc('increment_template_views', { template_uuid: id })
    
    if (error) throw error
    
    return successResponse({ message: 'View counted' })
  } catch (error) {
    return serverErrorResponse(error)
  }

}
