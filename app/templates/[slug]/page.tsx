import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTemplateBySlug } from '@/lib/template-catalog'
import { PreviewHero } from '@/components/template-detail/PreviewHero'
import { CapabilityMap } from '@/components/template-detail/CapabilityMap'

type TemplateDetailPageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: TemplateDetailPageProps): Promise<Metadata> {
  const template = getTemplateBySlug(params.slug)
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

export default function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const template = getTemplateBySlug(params.slug)

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
