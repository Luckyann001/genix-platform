'use client'

import { useEffect, useState } from 'react'
import { formatUSD } from '@/lib/currency'

type RefundRow = {
  id: string
  purchase_id: string
  buyer_id: string
  seller_id: string
  amount: number
  reason: string
  deployed: boolean
  status: string
  admin_note: string | null
  created_at: string
}

const FILTERS = ['pending', 'approved', 'rejected', 'all'] as const

export function RefundDashboard() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('pending')
  const [rows, setRows] = useState<RefundRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')
  const [aiBusyId, setAiBusyId] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, any>>({})

  async function loadData(nextFilter = filter) {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/refunds?status=${nextFilter}`)
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'Failed to load refunds')

      setRows(payload?.data?.refunds || [])
    } catch (err: any) {
      setError(err?.message || 'Failed to load refunds')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(filter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  async function approve(id: string) {
    const note = window.prompt('Optional note for approval') || ''
    setBusyId(id)

    try {
      const response = await fetch(`/api/admin/refunds/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'Approval failed')
      await loadData(filter)
    } catch (err: any) {
      setError(err?.message || 'Approval failed')
    } finally {
      setBusyId('')
    }
  }

  async function reject(id: string) {
    const note = window.prompt('Rejection reason (required)')
    if (!note) return

    setBusyId(id)

    try {
      const response = await fetch(`/api/admin/refunds/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'Rejection failed')
      await loadData(filter)
    } catch (err: any) {
      setError(err?.message || 'Rejection failed')
    } finally {
      setBusyId('')
    }
  }

  async function runAiReview(id: string) {
    setAiBusyId(id)
    setError('')
    try {
      const response = await fetch(`/api/admin/refunds/${id}/ai-review`, { method: 'POST' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'AI review failed')
      setAiSuggestions((prev) => ({ ...prev, [id]: payload?.data?.suggestion?.result || {} }))
    } catch (err: any) {
      setError(err?.message || 'AI review failed')
    } finally {
      setAiBusyId('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            className={`btn ${value === filter ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(value)}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>

      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="card">Loading refunds...</div>
      ) : rows.length === 0 ? (
        <div className="card">No refund requests in this state.</div>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.id} className="card">
              <p className="font-semibold">{formatUSD(Number(row.amount || 0))} • {row.status}</p>
              <p className="text-sm text-gray-700 mt-1">Reason: {row.reason}</p>
              <p className="text-xs text-gray-500 mt-1">Purchase: {row.purchase_id}</p>
              <p className="text-xs text-gray-500">Buyer: {row.buyer_id} • Seller: {row.seller_id}</p>
              <p className="text-xs text-gray-500">Deployed: {row.deployed ? 'Yes' : 'No'}</p>
              {row.admin_note && <p className="text-sm text-gray-700 mt-2">Admin note: {row.admin_note}</p>}
              {aiSuggestions[row.id] && (
                <div className="mt-3 rounded border border-blue-200 bg-blue-50 p-3 text-sm">
                  <p className="font-medium text-blue-900">
                    AI recommendation: {aiSuggestions[row.id].recommendation || 'manual_review'}{' '}
                    {typeof aiSuggestions[row.id].confidence === 'number' &&
                      `(confidence ${(aiSuggestions[row.id].confidence * 100).toFixed(0)}%)`}
                  </p>
                  {Array.isArray(aiSuggestions[row.id].reasoning) && aiSuggestions[row.id].reasoning.length > 0 && (
                    <p className="text-blue-800 mt-1">{aiSuggestions[row.id].reasoning.join(', ')}</p>
                  )}
                  {aiSuggestions[row.id].suggested_note && (
                    <p className="text-blue-800 mt-1">Suggested note: {aiSuggestions[row.id].suggested_note}</p>
                  )}
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <button className="btn btn-secondary" onClick={() => runAiReview(row.id)} disabled={aiBusyId === row.id}>
                  {aiBusyId === row.id ? 'AI Reviewing...' : 'AI Review'}
                </button>
                <button className="btn btn-primary" onClick={() => approve(row.id)} disabled={busyId === row.id || row.status !== 'pending'}>
                  Approve
                </button>
                <button className="btn btn-secondary" onClick={() => reject(row.id)} disabled={busyId === row.id || row.status !== 'pending'}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
