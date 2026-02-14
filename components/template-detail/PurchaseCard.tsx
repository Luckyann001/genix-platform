'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatUSD } from '@/lib/currency'

type PurchaseCardProps = {
  templateId: string
  templateSlug: string
  price: number
  exclusivePurchaseAvailable?: boolean
  exclusivePrice?: number | null
  supportPackageAvailable?: boolean
  supportPackagePrice?: number | null
}

export function PurchaseCard({
  templateId,
  templateSlug,
  price,
  exclusivePurchaseAvailable = false,
  exclusivePrice = null,
  supportPackageAvailable = false,
  supportPackagePrice = null,
}: PurchaseCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [needsAuth, setNeedsAuth] = useState(false)
  const [exclusivePurchase, setExclusivePurchase] = useState(false)
  const [supportPackage, setSupportPackage] = useState(false)

  async function handleBuyNow() {
    setLoading(true)
    setError('')
    setNeedsAuth(false)

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId, exclusivePurchase, supportPackage }),
      })

      const payload = await response.json()

      if (response.status === 401) {
        setNeedsAuth(true)
        return
      }

      if (!response.ok) {
        throw new Error(payload?.error || 'Could not start checkout')
      }

      const authorizationUrl = payload?.data?.authorizationUrl
      if (!authorizationUrl) {
        throw new Error('Missing payment authorization URL')
      }

      window.location.href = authorizationUrl
    } catch (err: any) {
      setError(err?.message || 'Could not start checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card mt-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-600">{exclusivePurchase ? 'Exclusive ownership license' : 'Standard multi-sale license'}</span>
        <span className="text-2xl font-bold">
          {formatUSD(
            (exclusivePurchase ? Number(exclusivePrice || price) : price) +
              (supportPackage ? Number(supportPackagePrice || 0) : 0)
          )}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {exclusivePurchaseAvailable && (
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="mt-1 rounded"
              checked={exclusivePurchase}
              onChange={(e) => setExclusivePurchase(e.target.checked)}
            />
            <span>
              Exclusive buyout (auto-unlist): {formatUSD(Number(exclusivePrice || 0))}
            </span>
          </label>
        )}

        {supportPackageAvailable && (
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="mt-1 rounded"
              checked={supportPackage}
              onChange={(e) => setSupportPackage(e.target.checked)}
            />
            <span>
              Add launch support package: +{formatUSD(Number(supportPackagePrice || 0))}
            </span>
          </label>
        )}
      </div>

      <button type="button" className="btn btn-primary w-full" onClick={handleBuyNow} disabled={loading}>
        {loading ? 'Redirecting...' : 'Buy Now'}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {needsAuth && (
        <div className="mt-4 rounded-lg border border-primary-200 bg-primary-50 p-4">
          <p className="text-sm text-primary-900 mb-3">Sign in to continue checkout.</p>
          <Link
            href={`/login?role=founder&next=${encodeURIComponent(`/templates/${templateSlug}`)}`}
            className="btn btn-secondary w-full"
          >
            Sign In / Sign Up
          </Link>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500">
        Standard license means this template can be sold to multiple buyers. Choose exclusive buyout to permanently
        remove it from the marketplace after your purchase.
      </p>

      <p className="mt-2 text-xs text-gray-500">
        30-day guarantee. Need help with a refund later? Visit{' '}
        <Link href="/refunds" className="underline">
          Refund Requests
        </Link>{' '}
        or plan your go-live with{' '}
        <Link href="/launch-assistant" className="underline">
          AI Launch Assistant
        </Link>
        .
      </p>
    </div>
  )
}
