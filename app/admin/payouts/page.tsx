import Link from 'next/link'
import { requireAdmin } from '@/lib/require-admin'
import { PayoutDashboard } from '@/components/admin/PayoutDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPayoutsPage() {
  await requireAdmin('/admin/payouts')

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom">
          <div className="mb-6">
            <Link href="/admin" className="text-primary-600 hover:underline text-sm">
              Back to Admin
            </Link>
            <h1 className="text-4xl font-bold mt-2">Payout Operations</h1>
            <p className="text-gray-600">Run payout dry-runs and execute live batches.</p>
          </div>

          <PayoutDashboard />
        </div>
      </section>
    </div>
  )
}
