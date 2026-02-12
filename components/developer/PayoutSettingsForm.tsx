'use client'

import { FormEvent, useEffect, useState } from 'react'

type Profile = {
  full_name?: string | null
  bank_name?: string | null
  bank_account_name?: string | null
  bank_account_number?: string | null
  paystack_recipient_code?: string | null
  recipient_code?: string | null
  bank_recipient_code?: string | null
  transfer_recipient_code?: string | null
}

export function PayoutSettingsForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [recipientCode, setRecipientCode] = useState('')

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/profile')
        const payload = await response.json()

        if (!response.ok) {
          throw new Error(payload?.error || 'Failed to load profile')
        }

        const profile: Profile = payload?.data || {}
        setBankName(profile.bank_name || '')
        setAccountName(profile.bank_account_name || '')
        setAccountNumber(profile.bank_account_number || '')
        setRecipientCode(
          profile.paystack_recipient_code ||
            profile.recipient_code ||
            profile.bank_recipient_code ||
            profile.transfer_recipient_code ||
            ''
        )
      } catch (err: any) {
        setError(err?.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bank_name: bankName.trim(),
          bank_account_name: accountName.trim(),
          bank_account_number: accountNumber.trim(),
          paystack_recipient_code: recipientCode.trim(),
          recipient_code: recipientCode.trim(),
          bank_recipient_code: recipientCode.trim(),
          transfer_recipient_code: recipientCode.trim(),
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to save payout settings')
      }

      setSuccess('Payout settings saved successfully.')
    } catch (err: any) {
      setError(err?.message || 'Failed to save payout settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="card">Loading payout settings...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-2xl font-semibold">Payout Settings</h2>
      <p className="text-sm text-gray-600">
        Enter the account details used for weekly payouts. Your Paystack transfer recipient code is required for live payouts.
      </p>

      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      <div>
        <label className="block text-sm font-medium mb-2">Bank Name</label>
        <input className="input" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g., GTBank" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Account Name</label>
        <input
          className="input"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="e.g., John Doe"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Account Number</label>
        <input
          className="input"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="10-digit account number"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Paystack Recipient Code</label>
        <input
          className="input"
          value={recipientCode}
          onChange={(e) => setRecipientCode(e.target.value)}
          placeholder="RCP_xxxxxxxxx"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving...' : 'Save Payout Settings'}
      </button>
    </form>
  )
}
