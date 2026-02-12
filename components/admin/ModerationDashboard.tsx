'use client'

import { useEffect, useState } from 'react'
import { formatUSD } from '@/lib/currency'

type TemplateRow = {
  id: string
  name: string
  category: string
  price: number
  review_status: 'pending' | 'approved' | 'rejected' | string
  review_feedback: string | null
  developer: {
    username?: string
    full_name?: string
    email?: string
  } | null
  demo_url: string | null
  created_at: string
}

type AiSuggestion = {
  decision?: string
  confidence?: number
  reasons?: string[]
  risks?: string[]
  suggested_feedback?: string
}

const FILTERS = ['pending', 'approved', 'rejected', 'all'] as const

export function ModerationDashboard() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('pending')
  const [items, setItems] = useState<TemplateRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')
  const [aiBusyId, setAiBusyId] = useState('')
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, AiSuggestion>>({})

  async function loadData(nextFilter = filter) {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/templates?status=${nextFilter}`)
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to load moderation queue')
      }

      setItems(payload?.data?.templates || [])
    } catch (err: any) {
      setError(err?.message || 'Failed to load moderation queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(filter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  async function approve(id: string) {
    setBusyId(id)
    try {
      const response = await fetch(`/api/admin/templates/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
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
    const reason = window.prompt('Enter rejection reason')
    if (!reason) return

    setBusyId(id)
    try {
      const response = await fetch(`/api/admin/templates/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
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
      const response = await fetch(`/api/admin/templates/${id}/ai-review`, {
        method: 'POST',
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'AI review failed')

      const suggestion = payload?.data?.suggestion?.result || {}
      setAiSuggestions((prev) => ({ ...prev, [id]: suggestion }))
    } catch (err: any) {
      setError(err?.message || 'AI review failed')
    } finally {
      setAiBusyId('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            className={`btn ${filter === value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(value)}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="card">Loading moderation queue...</div>
      ) : items.length === 0 ? (
        <div className="card">No templates in this state.</div>
      ) : (
        <div className="space-y-4">
          {items.map((template) => (
            <div key={template.id} className="card">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{template.name}</h3>
                  <p className="text-sm text-gray-600">
                    {template.category} • {formatUSD(Number(template.price || 0))} •{' '}
                    {template.developer?.full_name || template.developer?.username || template.developer?.email || 'Unknown developer'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Status: {template.review_status}</p>
                  {template.review_feedback && (
                    <p className="text-sm text-gray-700 mt-2">Feedback: {template.review_feedback}</p>
                  )}
                  {template.demo_url && (
                    <a href={template.demo_url} target="_blank" rel="noreferrer" className="text-sm text-primary-600 hover:underline mt-2 inline-block">
                      Open demo URL
                    </a>
                  )}
                  {aiSuggestions[template.id] && (
                    <div className="mt-3 rounded border border-blue-200 bg-blue-50 p-3 text-sm">
                      <p className="font-medium text-blue-900">
                        AI suggestion: {aiSuggestions[template.id].decision || 'manual_review'}{' '}
                        {typeof aiSuggestions[template.id].confidence === 'number' &&
                          `(confidence ${(aiSuggestions[template.id].confidence! * 100).toFixed(0)}%)`}
                      </p>
                      {Array.isArray(aiSuggestions[template.id].reasons) && aiSuggestions[template.id].reasons!.length > 0 && (
                        <p className="text-blue-800 mt-1">Reasons: {aiSuggestions[template.id].reasons!.join(', ')}</p>
                      )}
                      {aiSuggestions[template.id].suggested_feedback && (
                        <p className="text-blue-800 mt-1">Suggested feedback: {aiSuggestions[template.id].suggested_feedback}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => runAiReview(template.id)}
                    disabled={aiBusyId === template.id}
                  >
                    {aiBusyId === template.id ? 'AI Reviewing...' : 'AI Review'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => approve(template.id)}
                    disabled={busyId === template.id}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => reject(template.id)}
                    disabled={busyId === template.id}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
