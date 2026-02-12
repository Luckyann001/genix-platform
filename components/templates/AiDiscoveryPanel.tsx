'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatUSD } from '@/lib/currency'

type Recommendation = {
  id: string
  name: string
  category: string
  price: number
}

export function AiDiscoveryPanel() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rationale, setRationale] = useState('')
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  async function handleSearch() {
    if (!query.trim()) return
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'AI discovery failed')

      setRecommendations(payload?.data?.recommendations || [])
      setRationale(payload?.data?.suggestion?.result?.rationale || '')
    } catch (err: any) {
      setError(err?.message || 'AI discovery failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-2">AI Discovery</h2>
      <p className="text-sm text-gray-600 mb-3">Describe what you need and get AI-picked templates.</p>

      <div className="flex gap-2">
        <input
          className="input"
          placeholder="e.g. SaaS template with dashboard and auth"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn btn-secondary" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Ask AI'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      {rationale && <p className="text-sm text-gray-700 mt-3">Why these: {rationale}</p>}

      {recommendations.length > 0 && (
        <div className="mt-4 space-y-2">
          {recommendations.map((item) => (
            <Link key={item.id} href={`/templates/${item.id}`} className="block rounded border border-gray-200 p-3 hover:border-primary-300">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                {item.category} • {formatUSD(Number(item.price || 0))}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
