'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

type SubmitState = {
  type: 'idle' | 'success' | 'error'
  message: string
}

const PREVIEW_CONTRACT_SNIPPET = `window.addEventListener('message', (event) => {
  const data = event?.data
  if (!data || data.type !== 'GENIX_PREVIEW_CONFIG') return

  const cfg = data.payload || {}
  // Example mappings:
  // cfg.brand.name
  // cfg.theme.font_heading
  // cfg.theme.font_body
  // cfg.content.hero_title
  // cfg.content.hero_subtitle
  // cfg.assets.logo_url
  // cfg.assets.hero_image_url
  //
  // Apply these values to your React state / CSS variables.
})`

export function SubmitTemplateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitState, setSubmitState] = useState<SubmitState>({ type: 'idle', message: '' })
  const [needsAuth, setNeedsAuth] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [aiListingCopy, setAiListingCopy] = useState<{ short_description?: string; long_description?: string } | null>(null)
  const [aiChecklist, setAiChecklist] = useState<string[]>([])
  const [showContractModal, setShowContractModal] = useState(false)
  const [copiedContract, setCopiedContract] = useState(false)

  async function copyContractSnippet() {
    try {
      await navigator.clipboard.writeText(PREVIEW_CONTRACT_SNIPPET)
      setCopiedContract(true)
      window.setTimeout(() => setCopiedContract(false), 1200)
    } catch (_error) {
      setCopiedContract(false)
    }
  }

  async function handleAiAssist() {
    setAiLoading(true)
    setAiError('')
    try {
      const response = await fetch('/api/developer/submissions/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl,
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'AI assist failed')

      const result = payload?.data?.suggestion?.result || {}
      setAiListingCopy(result?.listing_copy || null)
      setAiChecklist(Array.isArray(result?.checklist) ? result.checklist : [])
    } catch (error: any) {
      const message = String(error?.message || '')
      if (message.includes('401') || message.toLowerCase().includes('unauthorized')) {
        setAiError('AI provider authorization failed. Set a valid OPENAI_API_KEY in your environment and redeploy.')
      } else {
        setAiError(message || 'AI assist failed')
      }
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitState({ type: 'idle', message: '' })
    setNeedsAuth(false)

    const form = event.currentTarget
    const formData = new FormData(form)

    const features = String(formData.get('features') || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

    const payload = {
      name: String(formData.get('name') || '').trim(),
      shortDescription: String(formData.get('shortDescription') || '').trim(),
      longDescription: String(formData.get('longDescription') || '').trim(),
      category: String(formData.get('category') || '').trim(),
      githubUrl: String(formData.get('githubUrl') || '').trim(),
      demoUrl: String(formData.get('demoUrl') || '').trim(),
      price: Number(formData.get('price') || 0),
      features,
      database: String(formData.get('database') || '').trim(),
      authentication: String(formData.get('authentication') || '').trim(),
      paymentProvider: String(formData.get('paymentProvider') || '').trim(),
      otherTools: String(formData.get('otherTools') || '').trim(),
      consultationAvailable: formData.get('consultationAvailable') === 'on',
      consultationRate: Number(formData.get('consultationRate') || 0),
    }

    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.status === 401) {
        setNeedsAuth(true)
        return
      }

      if (!response.ok) {
        throw new Error(result?.error || 'Template submission failed')
      }

      form.reset()
      setSubmitState({
        type: 'success',
        message: result?.data?.message || 'Template submitted successfully.',
      })
    } catch (error: any) {
      setSubmitState({
        type: 'error',
        message: error?.message || 'Template submission failed. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="card border-primary-200 bg-primary-50">
        <h2 className="text-xl font-semibold mb-2">AI Submission Assistant</h2>
        <p className="text-sm text-gray-700 mb-3">Generate listing copy and a quality checklist from your repo context.</p>
        <div className="flex gap-2">
          <input
            className="input bg-white"
            placeholder="https://github.com/username/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
          <button type="button" className="btn btn-secondary" onClick={handleAiAssist} disabled={aiLoading}>
            {aiLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
        {aiError && <p className="text-sm text-red-600 mt-3">{aiError}</p>}
        {aiListingCopy && (
          <div className="mt-3 text-sm text-gray-800 space-y-2">
            {aiListingCopy.short_description && (
              <p>
                <strong>Suggested short description:</strong> {aiListingCopy.short_description}
              </p>
            )}
            {aiListingCopy.long_description && (
              <p>
                <strong>Suggested long description:</strong> {aiListingCopy.long_description}
              </p>
            )}
          </div>
        )}
        {aiChecklist.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium">Checklist</p>
            <ul className="text-sm text-gray-700 mt-1 space-y-1">
              {aiChecklist.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Basic Info */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Template Name *</label>
            <input
              type="text"
              name="name"
              className="input"
              placeholder="e.g., SaaS Starter Pro"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Short Description * (Max 160 chars)</label>
            <input
              type="text"
              name="shortDescription"
              className="input"
              placeholder="Brief description for marketplace listing"
              maxLength={160}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Long Description *</label>
            <textarea
              name="longDescription"
              className="input min-h-[150px]"
              placeholder="Detailed description, features, use cases..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select name="category" className="input" required>
              <option value="">Select category</option>
              <option value="saas">SaaS</option>
              <option value="ecommerce">E-commerce</option>
              <option value="portfolio">Portfolio</option>
              <option value="landing">Landing Page</option>
              <option value="directory">Directory</option>
              <option value="blog">Blog</option>
              <option value="dashboard">Dashboard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="pt-6 border-t">
        <h2 className="text-xl font-semibold mb-4">Links</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">GitHub Repository URL *</label>
            <input
              type="url"
              name="githubUrl"
              className="input"
              placeholder="https://github.com/username/repo"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Must be a public repository</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Live Demo URL *</label>
            <input
              type="url"
              name="demoUrl"
              className="input"
              placeholder="https://demo.vercel.app"
              required
            />
            <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 p-3">
              <p className="text-sm text-amber-900">
                Buyers can customize your live preview only if your deployed demo listens for the Genix preview message
                contract.
              </p>
              <button
                type="button"
                onClick={() => setShowContractModal(true)}
                className="mt-2 text-sm font-medium text-amber-800 underline hover:text-amber-900"
              >
                View listener contract
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="pt-6 border-t">
        <h2 className="text-xl font-semibold mb-4">Pricing</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price (USD) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" name="price" className="input pl-8" placeholder="299" min="1" required />
            </div>
            <p className="text-sm text-gray-500 mt-1">You&apos;ll receive 70% of sales revenue</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="pt-6 border-t">
        <h2 className="text-xl font-semibold mb-4">Features & Tech Stack</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Key Features (comma separated) *</label>
            <input
              type="text"
              name="features"
              className="input"
              placeholder="Authentication, Paystack Integration, Admin Dashboard, Email Templates"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Database</label>
              <input type="text" name="database" className="input" placeholder="e.g., Supabase, PostgreSQL" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Authentication</label>
              <input type="text" name="authentication" className="input" placeholder="e.g., NextAuth, Supabase Auth" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payment Provider</label>
              <input type="text" name="paymentProvider" className="input" placeholder="e.g., Paystack" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Other Tools</label>
              <input type="text" name="otherTools" className="input" placeholder="e.g., Resend, Tailwind CSS" />
            </div>
          </div>
        </div>
      </div>

      {/* Consulting */}
      <div className="pt-6 border-t">
        <h2 className="text-xl font-semibold mb-4">Consulting (Optional)</h2>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="consultationAvailable" className="rounded" />
              <span className="text-sm">I&apos;m available for consulting work on this template</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Hourly Rate (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" name="consultationRate" className="input pl-8" placeholder="150" min="0" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">/hour</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">You&apos;ll receive 85% of consulting fees</p>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="pt-6 border-t">
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1" required />
          <span className="text-sm text-gray-600">
            I confirm that this is my original work, the code is production-ready, and I have the rights to sell it. I
            agree to provide 30 days of basic support to buyers.
          </span>
        </label>
      </div>

      {submitState.type !== 'idle' && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            submitState.type === 'success'
              ? 'border-green-300 bg-green-50 text-green-800'
              : 'border-red-300 bg-red-50 text-red-800'
          }`}
        >
          {submitState.message}
          {submitState.type === 'success' && (
            <div className="mt-2">
              <Link className="underline" href="/templates">
                View templates
              </Link>
            </div>
          )}
        </div>
      )}

      {needsAuth && (
        <div className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-900">
          <p className="mb-3">Sign in with GitHub to submit templates.</p>
          <Link href={`/login?role=developer&next=${encodeURIComponent('/submit')}`} className="btn btn-secondary w-full">
            Continue with GitHub
          </Link>
        </div>
      )}

      {/* Submit */}
      <div className="pt-6">
        <button type="submit" className="btn btn-primary w-full text-lg py-4" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </button>
        <p className="text-sm text-gray-500 text-center mt-4">
          We&apos;ll review your template within 24-48 hours and notify you via email.
        </p>
      </div>

      {showContractModal && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-xl bg-white border border-gray-200 shadow-xl">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Genix Live Preview Contract</h3>
              <button
                type="button"
                onClick={() => setShowContractModal(false)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-700">
                Add this listener in your deployed demo app. Genix customizer sends this payload via `postMessage`.
              </p>
              <pre className="rounded-lg bg-gray-900 text-gray-100 text-xs p-4 overflow-x-auto">
                <code>{PREVIEW_CONTRACT_SNIPPET}</code>
              </pre>
              <div className="text-sm text-gray-700">
                Payload fields:
                <div className="mt-1 font-mono text-xs">
                  `brand.name`, `theme.font_heading`, `theme.font_body`, `content.hero_title`,
                  `content.hero_subtitle`, `assets.logo_url`, `assets.hero_image_url`
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={copyContractSnippet} className="btn btn-secondary">
                  {copiedContract ? 'Copied' : 'Copy Snippet'}
                </button>
                <button type="button" onClick={() => setShowContractModal(false)} className="btn btn-primary">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}
