import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { TemplateRecord } from '@/lib/templates'
import { PurchaseCard } from '@/components/template-detail/PurchaseCard'

type PreviewHeroProps = {
  template: TemplateRecord
}

export function PreviewHero({ template }: PreviewHeroProps) {
  const hasPreviewUrl = Boolean(template.live_preview_url && template.live_preview_url !== '#')

  return (
    <section className="section-sm bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-sm text-primary-700 font-medium mb-2">{template.category}</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{template.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{template.summary}</p>
            <p className="text-sm text-gray-600 mb-6">Developer: {template.developer_name}</p>

            <div className="flex items-center gap-4">
              <a
                href={template.live_preview_url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                Live Preview
                <ExternalLink size={18} />
              </a>
              <Link href="/templates" className="btn btn-secondary">
                Back to Templates
              </Link>
            </div>
          </div>

          <div className="card">
            <div className="aspect-video rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 mb-4 overflow-hidden border border-gray-200">
              {hasPreviewUrl ? (
                <iframe
                  src={template.live_preview_url}
                  title={`${template.title} preview`}
                  loading="lazy"
                  className="w-full h-full"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-sm text-gray-600">{template.title}</span>
                </div>
              )}
            </div>
            <PurchaseCard templateId={template.id} templateSlug={template.slug} price={template.price} />
          </div>
        </div>
      </div>
    </section>
  )
}
