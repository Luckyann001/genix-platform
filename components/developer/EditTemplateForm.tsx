'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type EditTemplateInitialData = {
  id: string
  name: string
  shortDescription: string
  longDescription: string
  category: string
  githubUrl: string
  demoUrl: string
  price: number
  features: string[]
  database: string
  authentication: string
  paymentProvider: string
  otherTools: string
  consultationAvailable: boolean
  consultationRate: number
  exclusivePurchaseAvailable: boolean
  exclusivePrice: number
  supportPackageAvailable: boolean
  supportPackagePrice: number
  supportEmail: string
  supportChannel: string
  supportTimezone: string
  supportResponseSlaHours: number
  supportDurationDays: number
  supportIncluded: string
  supportExcluded: string
  guideBackendSetup: string
  guideAuthSetup: string
  guidePaymentsSetup: string
  guideAiBillingSetup: string
  guidePrivacySecurity: string
  guideDeploymentRunbook: string
}

type EditTemplateFormProps = {
  templateId: string
  initialData: EditTemplateInitialData
}

export function EditTemplateForm({ templateId, initialData }: EditTemplateFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState<EditTemplateInitialData>(initialData)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        ...form,
        name: String(form.name || '').trim(),
        shortDescription: String(form.shortDescription || '').trim(),
        longDescription: String(form.longDescription || '').trim(),
        category: String(form.category || '').trim(),
        githubUrl: String(form.githubUrl || '').trim(),
        demoUrl: String(form.demoUrl || '').trim(),
        features: Array.isArray(form.features)
          ? form.features.map((item) => String(item || '').trim()).filter(Boolean)
          : [],
      }

      const response = await fetch(`/api/templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result?.error || 'Failed to update template')

      setSuccess(result?.data?.message || 'Template updated successfully.')
      router.refresh()
    } catch (err: any) {
      setError(err?.message || 'Failed to update template')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Template Name *</label>
            <input className="input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Short Description *</label>
            <input className="input" value={form.shortDescription} onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} maxLength={160} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Long Description *</label>
            <textarea className="input min-h-[130px]" value={form.longDescription} onChange={(e) => setForm((p) => ({ ...p, longDescription: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <input className="input" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} required />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Links & Pricing</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL *</label>
            <input className="input" type="url" value={form.githubUrl} onChange={(e) => setForm((p) => ({ ...p, githubUrl: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Demo URL *</label>
            <input className="input" type="url" value={form.demoUrl} onChange={(e) => setForm((p) => ({ ...p, demoUrl: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price (USD) *</label>
            <input className="input" type="number" min="1" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value || 0) }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Features (comma separated)</label>
            <input
              className="input"
              value={form.features.join(', ')}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  features: String(e.target.value || '')
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean),
                }))
              }
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="rounded"
              checked={form.exclusivePurchaseAvailable}
              onChange={(e) => setForm((p) => ({ ...p, exclusivePurchaseAvailable: e.target.checked }))}
            />
            Offer exclusive buyout
          </label>
          <div>
            <label className="block text-sm font-medium mb-2">Exclusive Price (USD)</label>
            <input className="input" type="number" min="0" value={form.exclusivePrice} onChange={(e) => setForm((p) => ({ ...p, exclusivePrice: Number(e.target.value || 0) }))} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="rounded"
              checked={form.supportPackageAvailable}
              onChange={(e) => setForm((p) => ({ ...p, supportPackageAvailable: e.target.checked }))}
            />
            Offer paid support package
          </label>
          <div>
            <label className="block text-sm font-medium mb-2">Support Package Price (USD)</label>
            <input className="input" type="number" min="0" value={form.supportPackagePrice} onChange={(e) => setForm((p) => ({ ...p, supportPackagePrice: Number(e.target.value || 0) }))} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="rounded"
              checked={form.consultationAvailable}
              onChange={(e) => setForm((p) => ({ ...p, consultationAvailable: e.target.checked }))}
            />
            Available for consultation
          </label>
          <div>
            <label className="block text-sm font-medium mb-2">Consultation Rate (USD/hour)</label>
            <input className="input" type="number" min="0" value={form.consultationRate} onChange={(e) => setForm((p) => ({ ...p, consultationRate: Number(e.target.value || 0) }))} />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Database</label>
            <input className="input" value={form.database} onChange={(e) => setForm((p) => ({ ...p, database: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Authentication</label>
            <input className="input" value={form.authentication} onChange={(e) => setForm((p) => ({ ...p, authentication: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payment Provider</label>
            <input className="input" value={form.paymentProvider} onChange={(e) => setForm((p) => ({ ...p, paymentProvider: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Other Tools</label>
            <input className="input" value={form.otherTools} onChange={(e) => setForm((p) => ({ ...p, otherTools: e.target.value }))} />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Support Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Support Email *</label>
            <input className="input" type="email" value={form.supportEmail} onChange={(e) => setForm((p) => ({ ...p, supportEmail: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Support Channel *</label>
            <input className="input" value={form.supportChannel} onChange={(e) => setForm((p) => ({ ...p, supportChannel: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Timezone *</label>
            <input className="input" value={form.supportTimezone} onChange={(e) => setForm((p) => ({ ...p, supportTimezone: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Response SLA (hours) *</label>
            <input className="input" type="number" min="1" value={form.supportResponseSlaHours} onChange={(e) => setForm((p) => ({ ...p, supportResponseSlaHours: Number(e.target.value || 0) }))} required />
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">What&apos;s Included *</label>
            <textarea className="input min-h-[100px]" value={form.supportIncluded} onChange={(e) => setForm((p) => ({ ...p, supportIncluded: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">What&apos;s Excluded *</label>
            <textarea className="input min-h-[100px]" value={form.supportExcluded} onChange={(e) => setForm((p) => ({ ...p, supportExcluded: e.target.value }))} required />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Setup Guide</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Backend Setup *</label>
            <textarea className="input min-h-[90px]" value={form.guideBackendSetup} onChange={(e) => setForm((p) => ({ ...p, guideBackendSetup: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Auth Setup *</label>
            <textarea className="input min-h-[90px]" value={form.guideAuthSetup} onChange={(e) => setForm((p) => ({ ...p, guideAuthSetup: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Payments Setup *</label>
            <textarea className="input min-h-[90px]" value={form.guidePaymentsSetup} onChange={(e) => setForm((p) => ({ ...p, guidePaymentsSetup: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">AI Billing Setup *</label>
            <textarea className="input min-h-[90px]" value={form.guideAiBillingSetup} onChange={(e) => setForm((p) => ({ ...p, guideAiBillingSetup: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Privacy & Security *</label>
            <textarea className="input min-h-[90px]" value={form.guidePrivacySecurity} onChange={(e) => setForm((p) => ({ ...p, guidePrivacySecurity: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Deployment Runbook *</label>
            <textarea className="input min-h-[90px]" value={form.guideDeploymentRunbook} onChange={(e) => setForm((p) => ({ ...p, guideDeploymentRunbook: e.target.value }))} required />
          </div>
        </div>
      </div>

      {(error || success) && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${error ? 'border-red-300 bg-red-50 text-red-700' : 'border-green-300 bg-green-50 text-green-700'}`}>
          {error || success}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Template'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => router.push('/developer')}>
          Back to Dashboard
        </button>
      </div>
    </form>
  )
}
