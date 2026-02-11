import { listPublishedTemplates } from '@/lib/template-catalog'

export async function GET() {
	const templates = listPublishedTemplates().map((template) => ({
		id: template.id,
		slug: template.slug,
		title: template.title,
		category: template.category,
		preview_image: template.preview_image,
		price: template.price,
		developer_name: template.developer_name,
	}))

	return Response.json({ templates }, { status: 200 })
}
