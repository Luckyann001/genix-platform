'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatUSD } from '@/lib/currency'

type Recommendation = {
  id: string
  name: string
  category: string
  price: number
}

export function SmartRecommendations() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Recommendation[]>([])
  const [source, setSource] = useState('popular')

  useEffect(() => {
    async function run() {
      setLoading(true)
      try {
        const response = await fetch('/api/ai/recommendations')
        const payload = await response.json()
        if (response.ok) {
          setItems(payload?.data?.recommendations || [])
          setSource(payload?.data?.source || 'popular')
        }
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  if (loading || items.length === 0) return null

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-2">Recommended for You</h2>
      <p className="text-sm text-gray-600 mb-3">Source: {source === 'behavior' ? 'Your activity' : 'Popular templates'}</p>
      <div className="grid md:grid-cols-3 gap-3">
        {items.map((item) => (
          <Link key={item.id} href={`/templates/${item.id}`} className="rounded border border-gray-200 p-3 hover:border-primary-300">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-600">
              {item.category} • {formatUSD(Number(item.price || 0))}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
