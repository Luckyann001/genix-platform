import Link from 'next/link'
import { requireAuth } from '@/lib/require-auth'
import { RefundRequestPanel } from '@/components/refunds/RefundRequestPanel'

export const dynamic = 'force-dynamic'

export default async function RefundsPage() {
  await requireAuth('/refunds')

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom">
          <div className="mb-6">
            <Link href="/templates" className="text-primary-600 hover:underline text-sm">Back to Templates</Link>
            <h1 className="text-4xl font-bold mt-2">Refund Requests</h1>
            <p className="text-gray-600">30-day money-back request center.</p>
          </div>

          <RefundRequestPanel />
        </div>
      </section>
    </div>
  )
}
