import { createClient } from '@/lib/supabase/server'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  try {
    const { query, category } = await request.json()
    
    const { data, error } = await supabase
      .rpc('search_templates', {
        search_query: query,
        category_filter: category
      })
    
    if (error) throw error
    
    return successResponse(data)
  } catch (error) {
    return serverErrorResponse(error)
  }
}


