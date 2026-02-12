import Link from 'next/link'
import { requireAdmin } from '@/lib/require-admin'
import { RefundDashboard } from '@/components/admin/RefundDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminRefundsPage() {
  await requireAdmin('/admin/refunds')

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom">
          <div className="mb-6">
            <Link href="/admin" className="text-primary-600 hover:underline text-sm">Back to Admin</Link>
            <h1 className="text-4xl font-bold mt-2">Refund Requests</h1>
            <p className="text-gray-600">Process 30-day money-back requests.</p>
          </div>

          <RefundDashboard />
        </div>
      </section>
    </div>
  )
}
