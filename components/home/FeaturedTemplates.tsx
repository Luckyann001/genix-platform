import Link from 'next/link'
import { listPublishedTemplates } from '@/lib/template-catalog'
import { TemplateCard } from '@/components/templates/TemplateCard'

export function FeaturedTemplates() {
  const featured = listPublishedTemplates().slice(0, 3)

  return (
    <section className="section-sm bg-gray-50">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">Featured Templates</h2>
            <p className="text-gray-600">Top conversion-focused templates from verified developers.</p>
          </div>
          <Link href="/templates" className="btn btn-secondary hidden md:inline-flex">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link href="/templates" className="btn btn-secondary w-full">
            View all templates
          </Link>
        </div>
      </div>
    </section>
  )
}
