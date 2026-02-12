import { NextRequest } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'
import { isAdminUser } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

function readStatusFilter(raw: string | null): string {
  const value = String(raw || 'pending').toLowerCase()
  const valid = ['pending', 'approved', 'rejected', 'all']
  return valid.includes(value) ? value : 'pending'
}

function getReviewStatus(previewData: any): string {
  if (!previewData || typeof previewData !== 'object') return 'approved'
  return String(previewData.review_status || 'pending').toLowerCase()
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()
  if (!isAdminUser(user)) return unauthorizedResponse('Admin access required')

  try {
    const { searchParams } = new URL(request.url)
    const status = readStatusFilter(searchParams.get('status'))

    const { data, error } = await adminSupabase
      .from('templates')
      .select(
        'id, name, category, price, created_at, updated_at, developer_id, demo_url, preview_data, developer:profiles!templates_developer_id_fkey(username, full_name, email)'
      )
      .order('created_at', { ascending: false })

    if (error) throw error

    const rows = (data || []).map((template: any) => {
      const reviewStatus = getReviewStatus(template.preview_data)
      return {
        id: template.id,
        name: template.name,
        category: template.category,
        price: template.price,
        developer_id: template.developer_id,
        developer: template.developer || null,
        demo_url: template.demo_url,
        created_at: template.created_at,
        updated_at: template.updated_at,
        review_status: reviewStatus,
        review_feedback:
          template.preview_data && typeof template.preview_data === 'object'
            ? template.preview_data.review_feedback || null
            : null,
      }
    })

    const filtered = status === 'all' ? rows : rows.filter((row) => row.review_status === status)

    return successResponse({ templates: filtered, status })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
