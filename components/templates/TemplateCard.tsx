import Link from 'next/link'
import type { TemplateRecord } from '@/lib/templates'
import { formatUSD } from '@/lib/currency'

type TemplateCardProps = {
  template: TemplateRecord
}

export function TemplateCard({ template }: TemplateCardProps) {
  const hasPreviewUrl = Boolean(template.live_preview_url && template.live_preview_url !== '#')
  const stackItems = (template.stack || []).filter(Boolean)

  return (
    <Link href={`/templates/${template.id}`} className="card card-hover block">
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
      <p className="text-sm text-gray-600 mb-2">by {template.developer_name}</p>
      <p className="text-sm text-gray-600 mb-4">{template.summary}</p>

      {stackItems.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Stack</p>
          <div className="flex flex-wrap gap-2">
            {stackItems.slice(0, 4).map((item) => (
              <span key={item} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4 space-y-1 text-sm text-gray-600">
        <p>
          Support package:{' '}
          {template.support_package_available
            ? `Available${template.support_package_price ? ` (${formatUSD(template.support_package_price)})` : ''}`
            : 'Not included'}
        </p>
        <p>
          Consultation:{' '}
          {template.consultation_available
            ? `Available${template.consultation_rate ? ` (${formatUSD(template.consultation_rate)}/hour)` : ''}`
            : 'Not available'}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
        <span className="text-xs text-primary-700 font-medium">View details</span>
        <span className="text-xl font-bold">{formatUSD(template.price)}</span>
      </div>
    </Link>
  )
}
