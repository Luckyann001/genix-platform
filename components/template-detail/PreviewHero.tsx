import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { TemplateRecord } from '@/lib/template-catalog'

type PreviewHeroProps = {
  template: TemplateRecord
}

export function PreviewHero({ template }: PreviewHeroProps) {
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
            <div className="aspect-video rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 mb-4 flex items-center justify-center">
              <span className="text-sm text-gray-600">Screenshot: {template.preview_image}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">One-time price</span>
              <span className="text-3xl font-bold">${template.price}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
