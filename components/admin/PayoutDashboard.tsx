'use client'

import { useEffect, useState } from 'react'

type PayoutSummary = {
  pending_count: number
  pending_total: number
}

type PayoutRunResult = {
  developer_id: string
  amount: number
  entries: number
  status: string
  error_message: string | null
}

export function PayoutDashboard() {
  const [summary, setSummary] = useState<PayoutSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<PayoutRunResult[]>([])

  async function loadSummary() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/payouts')
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'Failed to load payouts')
      setSummary(payload?.data || null)
    } catch (err: any) {
      setError(err?.message || 'Failed to load payouts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSummary()
  }, [])

  async function runPayouts(dryRun: boolean) {
    setRunning(true)
    setError('')

    try {
      const response = await fetch('/api/admin/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'Payout run failed')

      setResults(payload?.data?.results || [])
      await loadSummary()
    } catch (err: any) {
      setError(err?.message || 'Payout run failed')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="card">Loading payout summary...</div>
      ) : (
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Pending Payouts</h2>
          <p className="text-gray-700">Items: {summary?.pending_count || 0}</p>
          <p className="text-gray-700">Amount: ₦{Number(summary?.pending_total || 0).toLocaleString()}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn btn-secondary" onClick={() => runPayouts(true)} disabled={running}>
              Run Dry-Run
            </button>
            <button type="button" className="btn btn-primary" onClick={() => runPayouts(false)} disabled={running}>
              Run Live Payout
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Live payout uses Paystack transfer recipient codes stored on developer profiles.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Last Run Results</h3>
          <div className="space-y-2">
            {results.map((result) => (
              <div key={`${result.developer_id}-${result.status}`} className="rounded border border-gray-200 p-3">
                <p className="font-medium">Developer: {result.developer_id}</p>
                <p className="text-sm text-gray-700">
                  ₦{Number(result.amount || 0).toLocaleString()} • {result.entries} entries • {result.status}
                </p>
                {result.error_message && <p className="text-sm text-red-600">{result.error_message}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
