import type { Metadata } from 'next'
import { FilterBar } from '@/components/templates/FilterBar'
import { TemplateCardGrid } from '@/components/templates/TemplateCardGrid'
import { Pagination } from '@/components/templates/Pagination'
import { listMarketplaceTemplates } from '@/lib/templates'

export const metadata: Metadata = {
  title: 'Templates | Genix',
  description: 'Browse published templates built by professional developers.',
}

type TemplatesPageProps = {
  searchParams: {
    page?: string | string[]
    category?: string | string[]
    q?: string | string[]
    submitted?: string | string[]
  }
}

const PAGE_SIZE = 6

function firstParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }
  return value ?? ''
}

export default async function TemplatesPage({ searchParams }: TemplatesPageProps) {
  const queryRaw = firstParam(searchParams.q)
  const categoryRaw = firstParam(searchParams.category)
  const pageRaw = firstParam(searchParams.page)
  const submittedRaw = firstParam(searchParams.submitted)

  const query = queryRaw.trim().toLowerCase()
  const category = categoryRaw || 'all'
  const page = Number(pageRaw || '1')
  const currentPage = Number.isNaN(page) || page < 1 ? 1 : page

  const templates = await listMarketplaceTemplates()
  const filtered = templates.filter((template) => {
    const matchesCategory = category === 'all' || template.category === category
    const searchable = `${template.title} ${template.category} ${template.developer_name}`.toLowerCase()
    const matchesQuery = !query || searchable.includes(query)
    return matchesCategory && matchesQuery
  })
  const categories = Array.from(new Set(templates.map((template) => template.category))).sort((a, b) =>
    a.localeCompare(b)
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom">
          <h1 className="text-4xl lg:text-5xl font-bold mb-2">Browse Templates</h1>
          <p className="text-lg text-gray-600 mb-8">
            Published templates only. Choose by category, price, and developer.
          </p>

          {submittedRaw === '1' && (
            <div className="mb-6 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
              Template submitted successfully and is pending admin review.
            </div>
          )}

          <FilterBar selectedCategory={category} query={queryRaw} categories={categories} />
          <TemplateCardGrid templates={pageItems} />
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            query={queryRaw}
            category={category}
          />
        </div>
      </section>
    </div>
  )
}
