'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Download, Image as ImageIcon, Loader2, Save, Type } from 'lucide-react'
import type { TemplateRecord } from '@/lib/templates'
import {
  DEFAULT_PREVIEW_CUSTOMIZATION,
  type PreviewCustomization,
} from '@/lib/customization-config'

type CustomizeClientProps = {
  templateId: string
  purchaseId: string | null
}

type LoadState = 'loading' | 'ready' | 'error'

const FONT_OPTIONS = ['Inter', 'Poppins', 'Montserrat', 'Roboto', 'Open Sans', 'Lato']

export function CustomizeClient({ templateId, purchaseId }: CustomizeClientProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [template, setTemplate] = useState<TemplateRecord | null>(null)
  const [config, setConfig] = useState<PreviewCustomization>(DEFAULT_PREVIEW_CUSTOMIZATION)
  const [state, setState] = useState<LoadState>('loading')
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [resolvedPurchaseId, setResolvedPurchaseId] = useState<string | null>(purchaseId)

  const previewOrigin = useMemo(() => {
    try {
      if (!template?.live_preview_url) return '*'
      const parsed = new URL(template.live_preview_url)
      return parsed.origin
    } catch (_error) {
      return '*'
    }
  }, [template?.live_preview_url])

  const sendConfigToPreview = useCallback(() => {
    const frame = iframeRef.current
    if (!frame?.contentWindow) return

    frame.contentWindow.postMessage(
      {
        type: 'GENIX_PREVIEW_CONFIG',
        version: '1.0',
        payload: config,
      },
      previewOrigin
    )
  }, [config, previewOrigin])

  useEffect(() => {
    let cancelled = false

    async function run() {
      setState('loading')
      setLoadError('')

      try {
        const templateResponse = await fetch(`/api/templates/${templateId}`)
        const templatePayload = await templateResponse.json()
        if (!templateResponse.ok) {
          throw new Error(templatePayload?.error || 'Template not found')
        }

        const customizationParams = new URLSearchParams({ templateId })
        if (purchaseId) customizationParams.set('purchaseId', purchaseId)

        const customizationResponse = await fetch(`/api/customizations?${customizationParams.toString()}`)
        const customizationPayload = await customizationResponse.json()
        if (!customizationResponse.ok) {
          throw new Error(customizationPayload?.error || 'Could not load customizations')
        }

        if (cancelled) return

        setTemplate(templatePayload?.data || null)
        setConfig(customizationPayload?.data?.customization || DEFAULT_PREVIEW_CUSTOMIZATION)
        setResolvedPurchaseId(customizationPayload?.data?.purchaseId || purchaseId)
        setState('ready')
      } catch (error) {
        if (cancelled) return
        setLoadError(error instanceof Error ? error.message : 'Could not load customizer')
        setState('error')
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [purchaseId, templateId])

  useEffect(() => {
    if (state !== 'ready') return
    sendConfigToPreview()
  }, [config, sendConfigToPreview, state])

  async function saveCustomization() {
    setSaving(true)
    setSaveError('')
    setSaveMessage('')

    try {
      const response = await fetch('/api/customizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          purchaseId: resolvedPurchaseId,
          config,
        }),
      })
      const payload = await response.json()
      if (!response.ok) {
        throw new Error(payload?.error || 'Could not save customization')
      }

      setSaveMessage('Customization saved.')
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not save customization')
    } finally {
      setSaving(false)
    }
  }

  function updateConfig<K extends keyof PreviewCustomization>(
    section: K,
    key: keyof PreviewCustomization[K],
    value: string
  ) {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
  }

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-700">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading customizer...</span>
        </div>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-12">
          <div className="max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-900">
            <h1 className="text-xl font-semibold mb-2">Customizer unavailable</h1>
            <p className="text-sm">{loadError || 'Could not load this customizer right now.'}</p>
          </div>
        </div>
      </div>
    )
  }

  const previewUrl = template?.live_preview_url || ''
  const hasPreview = Boolean(previewUrl && previewUrl !== '#')
  const previewWithParam = hasPreview
    ? `${previewUrl}${previewUrl.includes('?') ? '&' : '?'}genix_preview=1`
    : ''

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 gap-3">
            <div>
              <h1 className="text-xl font-bold">Template Customizer</h1>
              <p className="text-sm text-gray-600">{template?.title || 'Template'}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-secondary flex items-center gap-2" onClick={saveCustomization} disabled={saving}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save
              </button>
              <button className="btn btn-primary flex items-center gap-2" disabled>
                <Download size={16} />
                Download Code
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {(saveError || saveMessage) && (
          <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${saveError ? 'border-red-300 bg-red-50 text-red-800' : 'border-green-300 bg-green-50 text-green-800'}`}>
            {saveError || saveMessage}
          </div>
        )}

        <div className="grid lg:grid-cols-[360px,1fr] gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Type className="text-green-600" size={20} />
                </div>
                <h2 className="text-lg font-semibold">Brand & Text</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Brand Name</label>
                  <input
                    type="text"
                    className="input"
                    value={config.brand.name}
                    onChange={(event) => updateConfig('brand', 'name', event.target.value)}
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hero Title</label>
                  <input
                    type="text"
                    className="input"
                    value={config.content.hero_title}
                    onChange={(event) => updateConfig('content', 'hero_title', event.target.value)}
                    placeholder="Launch faster with confidence"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                  <textarea
                    className="input min-h-[100px]"
                    value={config.content.hero_subtitle}
                    onChange={(event) => updateConfig('content', 'hero_subtitle', event.target.value)}
                    placeholder="Describe your offer in one clear sentence."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Type className="text-blue-600" size={20} />
                </div>
                <h2 className="text-lg font-semibold">Fonts</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Heading Font</label>
                  <select
                    className="input"
                    value={config.theme.font_heading}
                    onChange={(event) => updateConfig('theme', 'font_heading', event.target.value)}
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Body Font</label>
                  <select
                    className="input"
                    value={config.theme.font_body}
                    onChange={(event) => updateConfig('theme', 'font_body', event.target.value)}
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="text-orange-600" size={20} />
                </div>
                <h2 className="text-lg font-semibold">Images</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Logo URL</label>
                  <input
                    type="url"
                    className="input"
                    value={config.assets.logo_url}
                    onChange={(event) => updateConfig('assets', 'logo_url', event.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hero Image URL</label>
                  <input
                    type="url"
                    className="input"
                    value={config.assets.hero_image_url}
                    onChange={(event) => updateConfig('assets', 'hero_image_url', event.target.value)}
                    placeholder="https://example.com/hero.jpg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Live Preview</h2>
              <span className="text-xs text-gray-500">Protocol: `GENIX_PREVIEW_CONFIG`</span>
            </div>

            {hasPreview ? (
              <div className="aspect-[16/10] bg-gray-100 rounded-lg border border-gray-300 overflow-hidden">
                <iframe
                  ref={iframeRef}
                  src={previewWithParam}
                  title="Template live preview"
                  className="w-full h-full"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  referrerPolicy="no-referrer"
                  onLoad={sendConfigToPreview}
                />
              </div>
            ) : (
              <div className="aspect-[16/10] bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600">
                This template does not include a live preview URL.
              </div>
            )}

            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              This preview updates only if the developer demo listens for `window.postMessage` with type
              `GENIX_PREVIEW_CONFIG`.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
