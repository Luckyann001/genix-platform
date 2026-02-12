import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireDeveloper } from '@/lib/require-developer'

export const dynamic = 'force-dynamic'

export default async function DeveloperDashboardPage() {
  const user = await requireDeveloper('/developer')
  const supabase = createClient()

  const [{ data: templates }, { data: notifications }] = await Promise.all([
    supabase
      .from('templates')
      .select('id, slug, name, price, created_at, preview_data')
      .eq('developer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('notifications')
      .select('id, title, message, type, action_url, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const templateRows = (templates || []).map((row: any) => ({
    ...row,
    review_status: String(row?.preview_data?.review_status || 'pending').toLowerCase(),
  }))

  const approvedCount = templateRows.filter((row: any) => row.review_status === 'approved').length
  const pendingCount = templateRows.filter((row: any) => row.review_status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-2">Developer Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage templates, review status, payouts, and developer notifications in one place.</p>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Link href="/developers/submit" className="card card-hover block">
              <h2 className="text-xl font-semibold mb-2">Submit Template</h2>
              <p className="text-gray-600">Create a new template listing for review.</p>
            </Link>
            <Link href="/developer/payout-settings" className="card card-hover block">
              <h2 className="text-xl font-semibold mb-2">Payout Settings</h2>
              <p className="text-gray-600">Add bank details and Paystack recipient code for payouts.</p>
            </Link>

            <Link href="/developer/earnings" className="card card-hover block">
              <h2 className="text-xl font-semibold mb-2">Earnings</h2>
              <p className="text-gray-600">Track sales, consultations, and pending amounts.</p>
            </Link>

            <Link href="/developer/payout-history" className="card card-hover block">
              <h2 className="text-xl font-semibold mb-2">Payout History</h2>
              <p className="text-gray-600">View queued, paid, and failed payout transfers.</p>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">My Templates</h2>
                <p className="text-sm text-gray-600">
                  {approvedCount} approved · {pendingCount} pending
                </p>
              </div>

              {templateRows.length === 0 ? (
                <p className="text-gray-600">No templates submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {templateRows.map((row: any) => (
                    <div key={row.id} className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{row.name}</p>
                          <p className="text-sm text-gray-600">${Number(row.price || 0)} · {row.review_status}</p>
                        </div>
                        <Link href={`/templates/${row.slug || row.id}`} className="text-sm text-primary-600 hover:underline">
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold mb-4">Notifications</h2>

              {(notifications || []).length === 0 ? (
                <p className="text-gray-600">No notifications yet.</p>
              ) : (
                <div className="space-y-3">
                  {(notifications || []).map((item: any) => (
                    <div key={item.id} className="rounded-lg border border-gray-200 p-3">
                      <p className="font-semibold">{item.title || item.type || 'Notification'}</p>
                      {item.message && <p className="text-sm text-gray-700 mt-1">{item.message}</p>}
                      {item.action_url && (
                        <Link href={item.action_url} className="text-sm text-primary-600 hover:underline mt-2 inline-block">
                          Open
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
