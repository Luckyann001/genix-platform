import type { TemplateRecord } from '@/lib/templates'
import { TemplateCard } from './TemplateCard'

type TemplateCardGridProps = {
  templates: TemplateRecord[]
}

export function TemplateCardGrid({ templates }: TemplateCardGridProps) {
  if (templates.length === 0) {
    return (
      <div className="card text-center">
        <h2 className="text-2xl font-semibold mb-2">No templates found</h2>
        <p className="text-gray-600">Try a different search or category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  )
}
