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
    const reason = String(body?.reason || body?.note || '').trim()

    if (!reason) {
      return errorResponse('Rejection reason is required')
    }

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
      review_status: 'rejected',
      review_feedback: reason,
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
      const primaryNotification = await adminSupabase.from('notifications').insert({
        user_id: existing.developer_id,
        type: 'template_rejected',
        title: 'Template Review Feedback',
        message: `Your template "${existing.name}" needs updates before approval.`,
        related_template_id: existing.id,
        action_url: `/developers/submit`,
      })

      if (primaryNotification.error) {
        await adminSupabase.from('notifications').insert({
          user_id: existing.developer_id,
          type: 'template_rejected',
          title: 'Template Review Feedback',
          message: `Your template "${existing.name}" needs updates before approval.`,
        })
      }
    }

    return successResponse({
      message: 'Template rejected with feedback',
      template: data,
    })
  } catch (error) {
    return serverErrorResponse(error)
  }
}
