import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getMarketplaceTemplateBySlugOrId } from '@/lib/templates'
import { PreviewHero } from '@/components/template-detail/PreviewHero'
import { CapabilityMap } from '@/components/template-detail/CapabilityMap'

export const dynamic = 'force-dynamic'

type TemplateDetailPageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: TemplateDetailPageProps): Promise<Metadata> {
  const template = await getMarketplaceTemplateBySlugOrId(params.slug)
  if (!template) {
    return {
      title: 'Template Not Found | Genix',
    }
  }

  return {
    title: `${template.title} | Genix`,
    description: template.summary,
  }
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const template = await getMarketplaceTemplateBySlugOrId(params.slug)

  if (!template) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <PreviewHero template={template} />
      <CapabilityMap template={template} />
    </div>
  )
}
