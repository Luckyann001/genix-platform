import Link from 'next/link'

type PaginationProps = {
  currentPage: number
  totalPages: number
  query?: string
  category?: string
}

function buildHref(page: number, query?: string, category?: string) {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (query) {
    params.set('q', query)
  }
  if (category && category !== 'all') {
    params.set('category', category)
  }
  return `/templates?${params.toString()}`
}

export function Pagination({ currentPage, totalPages, query, category }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      <Link
        href={buildHref(Math.max(1, currentPage - 1), query, category)}
        className={`btn btn-secondary ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
      >
        Previous
      </Link>
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1), query, category)}
        className={`btn btn-secondary ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
      >
        Next
      </Link>
    </div>
  )
}
