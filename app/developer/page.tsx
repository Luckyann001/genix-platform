import Link from 'next/link'
import { requireAuth } from '@/lib/require-auth'

export const dynamic = 'force-dynamic'

export default async function DeveloperDashboardPage() {
  await requireAuth('/developer')

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-2">Developer Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage payout settings, track earnings, and monitor payout history.</p>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/developer/payout-settings" className="card card-hover block">
              <h2 className="text-2xl font-semibold mb-2">Payout Settings</h2>
              <p className="text-gray-600">Add bank details and Paystack recipient code for payouts.</p>
            </Link>

            <Link href="/developer/earnings" className="card card-hover block">
              <h2 className="text-2xl font-semibold mb-2">Earnings</h2>
              <p className="text-gray-600">Track sales, consultations, and pending amounts.</p>
            </Link>

            <Link href="/developer/payout-history" className="card card-hover block">
              <h2 className="text-2xl font-semibold mb-2">Payout History</h2>
              <p className="text-gray-600">View queued, paid, and failed payout transfers.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
