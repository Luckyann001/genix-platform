import Link from 'next/link'
import type { TemplateRecord } from '@/lib/templates'

type TemplateCardProps = {
  template: TemplateRecord
}

export function TemplateCard({ template }: TemplateCardProps) {
  const hasPreviewUrl = Boolean(template.live_preview_url && template.live_preview_url !== '#')

  return (
    <Link href={`/templates/${template.slug}`} className="card card-hover block">
      <div className="aspect-video rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 mb-4 overflow-hidden border border-gray-200">
        {hasPreviewUrl ? (
          <iframe
            src={template.live_preview_url}
            title={`${template.title} live preview`}
            loading="lazy"
            className="w-full h-full pointer-events-none"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-sm text-gray-600">{template.title}</span>
          </div>
        )}
      </div>

      <div className="mb-3">
        <span className="inline-flex px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium">
          {template.category}
        </span>
      </div>

      <h3 className="text-xl font-semibold mb-1">{template.title}</h3>
      <p className="text-sm text-gray-600 mb-4">by {template.developer_name}</p>
      <p className="text-sm text-gray-600 mb-4">{template.summary}</p>

      <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
        <span className="text-xs text-gray-500">{template.id}</span>
        <span className="text-xl font-bold">₦{template.price.toLocaleString()}</span>
      </div>
    </Link>
  )
}
