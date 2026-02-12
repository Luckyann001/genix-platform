'use client'

import { useState } from 'react'

export function LaunchAssistantPanel() {
  const [projectName, setProjectName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [goals, setGoals] = useState('')
  const [templateName, setTemplateName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [plan, setPlan] = useState<any>(null)

  async function generatePlan() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/ai/launch-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          businessType,
          goals,
          templateName,
          deploymentTarget: 'vercel',
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || 'Failed to generate plan')
      setPlan(payload?.data?.plan?.result || null)
    } catch (err: any) {
      setError(err?.message || 'Failed to generate plan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-2xl font-semibold">AI Launch Assistant</h2>
      <p className="text-sm text-gray-600">Generate a practical launch plan after purchasing a template.</p>

      <input className="input" placeholder="Project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
      <input className="input" placeholder="Business type" value={businessType} onChange={(e) => setBusinessType(e.target.value)} />
      <input className="input" placeholder="Template name (optional)" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
      <textarea className="input" placeholder="Goals and constraints" value={goals} onChange={(e) => setGoals(e.target.value)} />

      <button className="btn btn-primary" onClick={generatePlan} disabled={loading || !projectName.trim()}>
        {loading ? 'Generating...' : 'Generate Launch Plan'}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {plan && (
        <div className="rounded border border-gray-200 p-4 text-sm">
          <p className="font-semibold mb-2">{plan.plan_title || 'Launch plan'}</p>
          {Array.isArray(plan.steps) && plan.steps.length > 0 && (
            <div className="mb-2">
              <p className="font-medium">Steps</p>
              <ul className="space-y-1 mt-1">
                {plan.steps.map((step: string) => (
                  <li key={step}>- {step}</li>
                ))}
              </ul>
            </div>
          )}
          {Array.isArray(plan.risks) && plan.risks.length > 0 && (
            <div>
              <p className="font-medium">Risks</p>
              <ul className="space-y-1 mt-1 text-red-700">
                {plan.risks.map((risk: string) => (
                  <li key={risk}>- {risk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
