'use client'

import { useEffect, useState } from 'react'
import { formatUSD } from '@/lib/currency'

type PurchaseRow = {
  id: string
  price: number
  status: string
  refund_status?: string | null
  created_at: string
  template?: { name?: string } | null
}

type RefundRow = {
  id: string
  amount: number
  status: string
  reason: string
  admin_note?: string | null
}

function within30Days(createdAt: string) {
  const created = new Date(createdAt)
  const limit = new Date(created)
  limit.setDate(limit.getDate() + 30)
  return new Date() <= limit
}

export function RefundRequestPanel() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [purchases, setPurchases] = useState<PurchaseRow[]>([])
  const [refunds, setRefunds] = useState<RefundRow[]>([])
  const [reasons, setReasons] = useState<Record<string, string>>({})
  const [deployed, setDeployed] = useState<Record<string, boolean>>({})
  const [submittingId, setSubmittingId] = useState('')

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      const [purchasesResponse, refundsResponse] = await Promise.all([fetch('/api/purchases'), fetch('/api/refunds')])
      const purchasesPayload = await purchasesResponse.json()
      const refundsPayload = await refundsResponse.json()

      if (!purchasesResponse.ok) {
        throw new Error(purchasesPayload?.error || 'Failed to load purchases')
      }
      if (!refundsResponse.ok) {
        throw new Error(refundsPayload?.error || 'Failed to load refunds')
      }

      setPurchases(purchasesPayload?.data?.purchases || [])
      setRefunds(refundsPayload?.data?.refunds || [])
    } catch (err: any) {
      setError(err?.message || 'Failed to load refund data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function submitRefund(purchaseId: string) {
    const reason = String(reasons[purchaseId] || '').trim()
    if (!reason) {
      setError('Please enter a reason before submitting a refund request.')
      return
    }

    setSubmittingId(purchaseId)
    setError('')

    try {
      const response = await fetch('/api/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaseId,
          reason,
          deployed: Boolean(deployed[purchaseId]),
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload?.error || 'Refund request failed')
      }

      setReasons((prev) => ({ ...prev, [purchaseId]: '' }))
      await loadData()
    } catch (err: any) {
      setError(err?.message || 'Refund request failed')
    } finally {
      setSubmittingId('')
    }
  }

  if (loading) {
    return <div className="card">Loading refunds...</div>
  }

  return (
    <div className="space-y-6">
      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Eligible Purchases</h2>
        {purchases.length === 0 ? (
          <p className="text-sm text-gray-600">No purchases found.</p>
        ) : (
          <div className="space-y-3">
            {purchases.map((purchase) => {
              const eligible = purchase.status === 'completed' && within30Days(purchase.created_at) && purchase.refund_status !== 'pending'
              return (
                <div key={purchase.id} className="rounded border border-gray-200 p-3">
                  <p className="font-medium">{purchase.template?.name || 'Template'} • {formatUSD(Number(purchase.price || 0))}</p>
                  <p className="text-xs text-gray-500">Purchase status: {purchase.status} • Refund status: {purchase.refund_status || 'none'}</p>

                  {eligible ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        className="input"
                        placeholder="Why are you requesting this refund?"
                        value={reasons[purchase.id] || ''}
                        onChange={(e) => setReasons((prev) => ({ ...prev, [purchase.id]: e.target.value }))}
                      />
                      <label className="text-sm flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={Boolean(deployed[purchase.id])}
                          onChange={(e) => setDeployed((prev) => ({ ...prev, [purchase.id]: e.target.checked }))}
                        />
                        I already deployed this template
                      </label>
                      <button className="btn btn-secondary" onClick={() => submitRefund(purchase.id)} disabled={submittingId === purchase.id}>
                        {submittingId === purchase.id ? 'Submitting...' : 'Request Refund'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mt-2">Not eligible for a new refund request.</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Refund History</h2>
        {refunds.length === 0 ? (
          <p className="text-sm text-gray-600">No refund requests yet.</p>
        ) : (
          <div className="space-y-2">
            {refunds.map((refund) => (
              <div key={refund.id} className="rounded border border-gray-200 p-3">
                <p className="font-medium">{formatUSD(Number(refund.amount || 0))} • {refund.status}</p>
                <p className="text-sm text-gray-700">{refund.reason}</p>
                {refund.admin_note && <p className="text-sm text-gray-600">Admin note: {refund.admin_note}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
