import { NextRequest } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { errorResponse, serverErrorResponse, successResponse, unauthorizedResponse } from '@/lib/api-response'
import { isAdminUser } from '@/lib/admin-auth'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: authData } = await supabase.auth.getUser()
  const user = authData.user
  if (!user) return unauthorizedResponse()
  if (!isAdminUser(user)) return unauthorizedResponse('Admin access required')

  try {
    const body = await request.json().catch(() => ({}))
    const note = String(body?.note || '').trim()

    const { data: existing, error: fetchError } = await adminSupabase
      .from('templates')
      .select('id, name, developer_id, preview_data')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return errorResponse('Template not found', 404)
    }

    const previewData = existing.preview_data && typeof existing.preview_data === 'object' ? existing.preview_data : {}

    const nextPreviewData = {
      ...previewData,
      review_status: 'approved',
      review_feedback: note || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    }

    const { data, error } = await adminSupabase
      .from('templates')
      .update({
        preview_data: nextPreviewData,
      })
      .eq('id', id)
      .select('id, name, preview_data')
      .single()

    if (error) throw error

    if (existing.developer_id) {
      await adminSupabase.from('notifications').insert({
        user_id: existing.developer_id,
        type: 'template_approved',
        title: 'Template Approved',
        message: `Your template "${existing.name}" has been approved and is now live.`,
        related_template_id: existing.id,
        action_url: `/templates/${existing.id}`,
      })
    }

    return successResponse({
      message: 'Template approved successfully',
      template: data,
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
