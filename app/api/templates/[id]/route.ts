import { NextRequest } from 'next/server'
import { notFoundResponse, successResponse } from '@/lib/api-response'
import { getMarketplaceTemplateBySlugOrId } from '@/lib/templates'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
  const template = await getMarketplaceTemplateBySlugOrId(id)
  if (!template) return notFoundResponse('Template not found')
	return successResponse(template)
}
