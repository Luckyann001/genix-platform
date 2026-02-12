import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/require-auth'

export const dynamic = 'force-dynamic'

export default async function DeveloperPayoutHistoryPage() {
  const user = await requireAuth('/developer/payout-history')
  const supabase = createClient()

  const { data, error } = await supabase
    .from('payout_transfers')
    .select('id, source_type, source_id, amount, status, payout_reference, error_message, created_at, paid_at')
    .eq('developer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(200)

  const rows = data || []

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom">
          <Link href="/developer" className="text-primary-600 hover:underline text-sm">
            Back to Developer Dashboard
          </Link>
          <h1 className="text-4xl font-bold mt-2 mb-2">Payout History</h1>
          <p className="text-gray-600 mb-8">Review all payout transfer records and statuses.</p>

          {error ? (
            <div className="card text-red-700">Failed to load payout history. Make sure `payout_transfers` exists.</div>
          ) : rows.length === 0 ? (
            <div className="card">No payout transfers yet.</div>
          ) : (
            <div className="card overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4">Date</th>
                    <th className="text-left py-2 pr-4">Type</th>
                    <th className="text-left py-2 pr-4">Amount</th>
                    <th className="text-left py-2 pr-4">Status</th>
                    <th className="text-left py-2 pr-4">Reference</th>
                    <th className="text-left py-2 pr-4">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-b align-top">
                      <td className="py-2 pr-4">{new Date(row.created_at).toLocaleString()}</td>
                      <td className="py-2 pr-4">{row.source_type}</td>
                      <td className="py-2 pr-4">₦{Number(row.amount || 0).toLocaleString()}</td>
                      <td className="py-2 pr-4">{row.status}</td>
                      <td className="py-2 pr-4">{row.payout_reference}</td>
                      <td className="py-2 pr-4 text-red-600">{row.error_message || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
