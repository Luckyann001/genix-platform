'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CheckCircle2, ExternalLink, Loader2, Rocket, Save, Settings2 } from 'lucide-react'

type LaunchClientProps = {
  purchaseId: string
}

type LaunchResponse = {
  purchase: {
    id: string
    template_id: string
    status: string
    launch_status: string
    launch_live_url?: string | null
    launch_admin_url?: string | null
  }
  template: {
    id: string
    name: string
    github_url?: string | null
    demo_url?: string | null
    setup_guide?: {
      backend_setup?: string
      auth_setup?: string
      payments_setup?: string
      ai_billing_setup?: string
      privacy_security?: string
      deployment_runbook?: string
    }
  } | null
  project: {
    status: string
    onboarding_data: Record<string, any>
    post_launch_settings?: Record<string, any>
    live_url?: string | null
    admin_panel_url?: string | null
    admin_credentials?: Record<string, any>
  } | null
  hostingConnection: {
    id: string
    provider: string
    connected_at: string
  } | null
}

const EMPTY_ONBOARDING = {
  brand_name: '',
  domain: '',
  domain_mode: 'genix_subdomain',
  genix_subdomain: '',
  custom_domain: '',
  custom_domain_provider: '',
  custom_domain_dns_verified: false,
  custom_domain_verified: false,
  business_email: '',
  payment_account: '',
  legal_pages_ready: false,
}

const EMPTY_EDITOR = {
  brand_name: '',
  headline: '',
  subheadline: '',
}

export function LaunchClient({ purchaseId }: LaunchClientProps) {
  const [data, setData] = useState<LaunchResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [message, setMessage] = useState('')

  const [onboarding, setOnboarding] = useState<Record<string, any>>(EMPTY_ONBOARDING)
  const [editor, setEditor] = useState<Record<string, any>>(EMPTY_EDITOR)

  useEffect(() => {
    let ignore = false
    async function run() {
      setLoading(true)
      try {
        const response = await fetch(`/api/launch/projects/${purchaseId}`)
        const payload = await response.json()
        if (!response.ok) throw new Error(payload?.error || 'Failed to load launch flow')
        if (ignore) return

        const nextData: LaunchResponse = payload?.data
        setData(nextData)
        const onboardingData = nextData?.project?.onboarding_data || EMPTY_ONBOARDING
        setOnboarding({
          ...EMPTY_ONBOARDING,
          ...onboardingData,
        })
        setEditor({
          ...EMPTY_EDITOR,
          brand_name: onboardingData.brand_name || '',
        })
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Could not load launch flow')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()
    return () => {
      ignore = true
    }
  }, [purchaseId])

  async function saveOnboarding() {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const domainMode = String(onboarding.domain_mode || 'genix_subdomain') === 'custom_domain' ? 'custom_domain' : 'genix_subdomain'
      const normalizedGenixSubdomain = String(onboarding.genix_subdomain || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48)
      const normalizedCustomDomain = String(onboarding.custom_domain || '').trim().toLowerCase()
      const resolvedDomain =
        domainMode === 'custom_domain' ? normalizedCustomDomain : normalizedGenixSubdomain ? `${normalizedGenixSubdomain}.genix.site` : ''

      const response = await fetch(`/api/launch/projects/${purchaseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          onboardingData: {
            ...onboarding,
            domain_mode: domainMode,
            genix_subdomain: normalizedGenixSubdomain,
            custom_domain: normalizedCustomDomain,
            domain: resolvedDomain,
          },
          status: 'ready',
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'Failed to save onboarding')
      setMessage('Onboarding saved.')
      const refreshed = await fetch(`/api/launch/projects/${purchaseId}`)
      const refreshedPayload = await refreshed.json()
      if (refreshed.ok) setData(refreshedPayload?.data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save onboarding')
    } finally {
      setSaving(false)
    }
  }

  async function deployNow() {
    setDeploying(true)
    setMessage('')
    setError('')
    try {
      const response = await fetch(`/api/launch/projects/${purchaseId}/deploy`, { method: 'POST' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'Deploy failed')
      setMessage(payload?.data?.message || 'Deployment completed.')

      const refreshed = await fetch(`/api/launch/projects/${purchaseId}`)
      const refreshedPayload = await refreshed.json()
      if (refreshed.ok) setData(refreshedPayload?.data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deploy failed')
    } finally {
      setDeploying(false)
    }
  }

  async function savePostLaunchEditor() {
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const templateId = String(data?.purchase?.template_id || '')
      if (!templateId) throw new Error('Template not found')

      const response = await fetch('/api/customizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          purchaseId,
          config: {
            brand: { name: String(editor.brand_name || '') },
            theme: { font_heading: 'Inter', font_body: 'Inter' },
            content: {
              hero_title: String(editor.headline || ''),
              hero_subtitle: String(editor.subheadline || ''),
            },
            assets: {
              logo_url: '',
              hero_image_url: '',
            },
          },
        }),
      })

      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'Failed to save post-launch edits')
      setMessage('Post-launch editor settings saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save editor')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-700">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading launch flow...
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="min-h-screen">
        <div className="container-custom py-16">
          <div className="card border border-red-300 bg-red-50 text-red-900">{error}</div>
        </div>
      </div>
    )
  }

  const liveUrl = data?.project?.live_url || data?.purchase?.launch_live_url || ''
  const adminUrl = data?.project?.admin_panel_url || data?.purchase?.launch_admin_url || ''
  const domainMode = String(onboarding.domain_mode || 'genix_subdomain') === 'custom_domain' ? 'custom_domain' : 'genix_subdomain'
  const normalizedGenixSubdomain = String(onboarding.genix_subdomain || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  const normalizedCustomDomain = String(onboarding.custom_domain || '').trim().toLowerCase()
  const customDnsVerified = Boolean(onboarding.custom_domain_dns_verified)
  const customDomainVerified = Boolean(onboarding.custom_domain_verified)
  const selectedDomain =
    domainMode === 'custom_domain'
      ? normalizedCustomDomain
      : normalizedGenixSubdomain
      ? `${normalizedGenixSubdomain}.genix.site`
      : ''

  let deployBlockedReason = ''
  if (!data?.hostingConnection) {
    deployBlockedReason = 'Connect Vercel to continue.'
  } else if (domainMode === 'custom_domain') {
    if (!normalizedCustomDomain) deployBlockedReason = 'Add your custom domain.'
    else if (!customDnsVerified) deployBlockedReason = 'Complete DNS setup and confirm records.'
    else if (!customDomainVerified) deployBlockedReason = 'Verify your custom domain before launching.'
  } else if (!normalizedGenixSubdomain) {
    deployBlockedReason = 'Choose your free Genix subdomain.'
  }

  return (
    <div className="min-h-screen">
      <div className="container-custom py-10 space-y-6">
        <div className="card">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm text-slate-500">Purchase #{purchaseId.slice(0, 8)}</p>
              <h1 className="text-3xl font-display font-bold">Managed Launch Flow</h1>
              <p className="text-slate-600 mt-1">
                Template: <strong>{data?.template?.name || 'Template'}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 capitalize">
                {data?.project?.status || data?.purchase?.launch_status || 'onboarding'}
              </span>
              <Link href={`/customize/${data?.purchase?.template_id}?purchase=${purchaseId}`} className="btn btn-secondary">
                Open Customizer
              </Link>
            </div>
          </div>
        </div>

        {(message || error) && (
          <div className={`card ${error ? 'border border-red-300 bg-red-50 text-red-900' : 'border border-green-300 bg-green-50 text-green-900'}`}>
            {error || message}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Settings2 size={18} /> Guided Onboarding
            </h2>

            <div>
              <label className="block text-sm font-medium mb-1">Brand Name</label>
              <input
                className="input"
                value={String(onboarding.brand_name || '')}
                onChange={(e) => setOnboarding((prev) => ({ ...prev, brand_name: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Launch Domain</label>
              <div className="space-y-3">
                <label className="flex items-start gap-2 rounded-lg border border-gray-200 p-3">
                  <input
                    type="radio"
                    name="domainMode"
                    className="mt-1"
                    checked={domainMode === 'genix_subdomain'}
                    onChange={() =>
                      setOnboarding((prev) => ({
                        ...prev,
                        domain_mode: 'genix_subdomain',
                        custom_domain_verified: false,
                      }))
                    }
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900 block">Use free Genix subdomain</span>
                    Launch fast with `yourname.genix.site`.
                  </span>
                </label>

                <label className="flex items-start gap-2 rounded-lg border border-gray-200 p-3">
                  <input
                    type="radio"
                    name="domainMode"
                    className="mt-1"
                    checked={domainMode === 'custom_domain'}
                    onChange={() =>
                      setOnboarding((prev) => ({
                        ...prev,
                        domain_mode: 'custom_domain',
                      }))
                    }
                  />
                  <span className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900 block">Connect custom domain</span>
                    Use your own domain from any registrar.
                  </span>
                </label>
              </div>
            </div>

            {domainMode === 'genix_subdomain' ? (
              <div>
                <label className="block text-sm font-medium mb-1">Choose subdomain</label>
                <div className="flex items-center gap-2">
                  <input
                    className="input"
                    placeholder="mybrand"
                    value={String(onboarding.genix_subdomain || '')}
                    onChange={(e) =>
                      setOnboarding((prev) => ({
                        ...prev,
                        genix_subdomain: e.target.value,
                      }))
                    }
                  />
                  <span className="text-sm text-gray-600 whitespace-nowrap">.genix.site</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 rounded-lg border border-gray-200 p-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Custom domain</label>
                  <input
                    className="input"
                    placeholder="app.yourdomain.com"
                    value={String(onboarding.custom_domain || '')}
                    onChange={(e) =>
                      setOnboarding((prev) => ({
                        ...prev,
                        custom_domain: e.target.value,
                        custom_domain_verified: false,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">DNS provider (optional)</label>
                  <input
                    className="input"
                    placeholder="Cloudflare, Namecheap, GoDaddy..."
                    value={String(onboarding.custom_domain_provider || '')}
                    onChange={(e) =>
                      setOnboarding((prev) => ({
                        ...prev,
                        custom_domain_provider: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <p>DNS steps (provider-agnostic):</p>
                  <p>1. Add `CNAME` record: host `www` → target `cname.vercel-dns.com`.</p>
                  <p>2. Add `A` record: host `@` → target `76.76.21.21`.</p>
                  <p>3. Wait for DNS propagation, then verify below.</p>
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={Boolean(onboarding.custom_domain_dns_verified)}
                    onChange={(e) =>
                      setOnboarding((prev) => ({
                        ...prev,
                        custom_domain_dns_verified: e.target.checked,
                        custom_domain_verified: e.target.checked ? Boolean(prev.custom_domain_verified) : false,
                      }))
                    }
                  />
                  DNS records configured
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      setOnboarding((prev) => ({
                        ...prev,
                        custom_domain_verified: Boolean(prev.custom_domain_dns_verified && String(prev.custom_domain || '').trim()),
                      }))
                    }
                  >
                    Verify Domain
                  </button>
                  <span
                    className={`text-xs font-medium ${
                      customDomainVerified ? 'text-green-700' : 'text-amber-700'
                    }`}
                  >
                    {customDomainVerified ? 'Verification status: Verified' : 'Verification status: Pending'}
                  </span>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-600">
              Selected domain: <span className="font-medium text-gray-800">{selectedDomain || 'Not configured'}</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Business Email</label>
              <input
                className="input"
                placeholder="founder@company.com"
                value={String(onboarding.business_email || '')}
                onChange={(e) => setOnboarding((prev) => ({ ...prev, business_email: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Account (Stripe/Paystack)</label>
              <input
                className="input"
                placeholder="acct_... or merchant code"
                value={String(onboarding.payment_account || '')}
                onChange={(e) => setOnboarding((prev) => ({ ...prev, payment_account: e.target.value }))}
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="rounded"
                checked={Boolean(onboarding.legal_pages_ready)}
                onChange={(e) => setOnboarding((prev) => ({ ...prev, legal_pages_ready: e.target.checked }))}
              />
              Legal pages ready (terms/privacy/refund)
            </label>

            <button className="btn btn-primary" onClick={saveOnboarding} disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Onboarding
            </button>
          </div>

          <div className="card space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Rocket size={18} /> Deploy to Vercel
            </h2>

            {data?.hostingConnection ? (
              <p className="text-sm text-green-700 flex items-center gap-2">
                <CheckCircle2 size={16} />
                Vercel connected ({data.hostingConnection.provider})
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Connect your Vercel account to deploy to a buyer-owned project.</p>
                <a href={`/api/launch/vercel/connect?purchaseId=${purchaseId}`} className="btn btn-secondary inline-flex">
                  Connect Vercel
                </a>
              </div>
            )}

            <button className="btn btn-primary" onClick={deployNow} disabled={deploying || Boolean(deployBlockedReason)}>
              {deploying ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
              One-Click Deploy
            </button>
            {deployBlockedReason && <p className="text-sm text-amber-700">{deployBlockedReason}</p>}

            {liveUrl && (
              <div className="rounded-lg border border-green-300 bg-green-50 p-4 space-y-2">
                <p className="text-sm text-green-900 font-medium">Live URL ready</p>
                <a href={liveUrl} target="_blank" rel="noreferrer" className="text-sm text-primary-700 underline inline-flex items-center gap-1">
                  {liveUrl} <ExternalLink size={13} />
                </a>
                {adminUrl && (
                  <a href={adminUrl} target="_blank" rel="noreferrer" className="block text-sm text-primary-700 underline inline-flex items-center gap-1">
                    Admin panel <ExternalLink size={13} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Post-Launch Editor</h2>
          <p className="text-sm text-slate-600">
            Update brand and core copy after go-live. This stores buyer-level settings that can be synced to your running app.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Brand Name</label>
              <input
                className="input"
                value={String(editor.brand_name || '')}
                onChange={(e) => setEditor((prev) => ({ ...prev, brand_name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Headline</label>
              <input
                className="input"
                value={String(editor.headline || '')}
                onChange={(e) => setEditor((prev) => ({ ...prev, headline: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subheadline</label>
              <input
                className="input"
                value={String(editor.subheadline || '')}
                onChange={(e) => setEditor((prev) => ({ ...prev, subheadline: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn btn-secondary" onClick={savePostLaunchEditor} disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Post-Launch Edits
            </button>
            <Link href={`/customize/${data?.purchase?.template_id}?purchase=${purchaseId}`} className="text-sm text-primary-700 underline">
              Open advanced customizer
            </Link>
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Developer Setup Guide</h2>
          <p className="text-sm text-slate-600">
            Complete this checklist to configure backend, payments, AI billing, and secure production launch.
          </p>

          <div className="space-y-3 text-sm text-slate-700">
            <div>
              <p className="font-medium text-slate-900">Backend setup</p>
              <p>{String(data?.template?.setup_guide?.backend_setup || 'Not provided.')}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Authentication setup</p>
              <p>{String(data?.template?.setup_guide?.auth_setup || 'Not provided.')}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Payments by region</p>
              <p>{String(data?.template?.setup_guide?.payments_setup || 'Not provided.')}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">AI billing and tokens</p>
              <p>{String(data?.template?.setup_guide?.ai_billing_setup || 'Not provided.')}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Privacy and security</p>
              <p>{String(data?.template?.setup_guide?.privacy_security || 'Not provided.')}</p>
            </div>
            <div>
              <p className="font-medium text-slate-900">Deployment runbook</p>
              <p>{String(data?.template?.setup_guide?.deployment_runbook || 'Not provided.')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
