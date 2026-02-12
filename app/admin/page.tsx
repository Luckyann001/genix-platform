import Link from 'next/link'
import { requireAdmin } from '@/lib/require-admin'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  await requireAdmin('/admin')

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage moderation, payouts, and platform operations.</p>

          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/admin/templates" className="card card-hover block">
              <h2 className="text-2xl font-semibold mb-2">Template Moderation</h2>
              <p className="text-gray-600">Review pending templates, approve or reject submissions.</p>
            </Link>

            <Link href="/admin/payouts" className="card card-hover block">
              <h2 className="text-2xl font-semibold mb-2">Payout Operations</h2>
              <p className="text-gray-600">Preview pending payouts and run developer payout batches.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
