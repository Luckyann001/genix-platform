import Link from 'next/link'
import { requireAdmin } from '@/lib/require-admin'
import { ModerationDashboard } from '@/components/admin/ModerationDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminTemplatesPage() {
  await requireAdmin('/admin/templates')

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom">
          <div className="mb-6">
            <Link href="/admin" className="text-primary-600 hover:underline text-sm">
              Back to Admin
            </Link>
            <h1 className="text-4xl font-bold mt-2">Template Moderation</h1>
            <p className="text-gray-600">Approve, reject, and review submitted templates.</p>
          </div>

          <ModerationDashboard />
        </div>
      </section>
    </div>
  )
}
