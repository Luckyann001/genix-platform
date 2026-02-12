import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/require-auth'
import { formatUSD } from '@/lib/currency'

export const dynamic = 'force-dynamic'

function sumBy(rows: any[], key: string) {
  return rows.reduce((sum, row) => sum + Number(row?.[key] || 0), 0)
}

export default async function DeveloperEarningsPage() {
  const user = await requireAuth('/developer/earnings')
  const supabase = createClient()

  const [purchasesResult, consultationsResult, payoutsResult] = await Promise.all([
    supabase
      .from('purchases')
      .select('id, developer_earnings, status, created_at')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('consultations')
      .select('id, developer_earnings, status, scheduled_for, created_at')
      .eq('developer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('payout_transfers')
      .select('id, amount, status, source_type, created_at')
      .eq('developer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100),
  ])

  const purchases = purchasesResult.data || []
  const consultations = consultationsResult.data || []
  const payouts = payoutsResult.data || []

  const completedPurchases = purchases.filter((row) => row.status === 'completed')
  const completedConsultations = consultations.filter((row) => row.status === 'completed' || row.status === 'scheduled')

  const salesEarnings = sumBy(completedPurchases, 'developer_earnings')
  const consultationEarnings = sumBy(completedConsultations, 'developer_earnings')
  const totalEarnings = salesEarnings + consultationEarnings

  const paidPayouts = payouts.filter((row) => row.status === 'paid')
  const paidOut = sumBy(paidPayouts, 'amount')
  const pendingBalance = Math.max(totalEarnings - paidOut, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom">
          <Link href="/developer" className="text-primary-600 hover:underline text-sm">
            Back to Developer Dashboard
          </Link>
          <h1 className="text-4xl font-bold mt-2 mb-2">Earnings</h1>
          <p className="text-gray-600 mb-8">Track template sales, consultations, and payout progress.</p>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <p className="text-sm text-gray-600">Template Earnings</p>
              <p className="text-2xl font-bold">{formatUSD(salesEarnings)}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600">Consultation Earnings</p>
              <p className="text-2xl font-bold">{formatUSD(consultationEarnings)}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600">Paid Out</p>
              <p className="text-2xl font-bold">{formatUSD(paidOut)}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600">Pending Balance</p>
              <p className="text-2xl font-bold">{formatUSD(pendingBalance)}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Recent Template Sales</h2>
              {purchases.length === 0 ? (
                <p className="text-sm text-gray-600">No template sales yet.</p>
              ) : (
                <div className="space-y-3">
                  {purchases.slice(0, 8).map((row) => (
                    <div key={row.id} className="border rounded p-3">
                      <p className="font-medium">{formatUSD(Number(row.developer_earnings || 0))}</p>
                      <p className="text-sm text-gray-600">Status: {row.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Recent Consultations</h2>
              {consultations.length === 0 ? (
                <p className="text-sm text-gray-600">No consultations yet.</p>
              ) : (
                <div className="space-y-3">
                  {consultations.slice(0, 8).map((row) => (
                    <div key={row.id} className="border rounded p-3">
                      <p className="font-medium">{formatUSD(Number(row.developer_earnings || 0))}</p>
                      <p className="text-sm text-gray-600">Status: {row.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card mt-6">
            <h3 className="text-xl font-semibold mb-2">How consultation payments work</h3>
            <ol className="text-sm text-gray-700 space-y-1">
              <li>1. Buyer books a consultation and pays through Paystack.</li>
              <li>2. Platform automatically splits earnings as 15% platform and 85% developer.</li>
              <li>3. On successful payment webhook, consultation is confirmed as scheduled.</li>
              <li>4. Completed earnings appear in your payout queue and are released in payout runs.</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  )
}
