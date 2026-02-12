const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions'
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'

const CUSTOMIZATION_SYSTEM_PROMPT =
  'You are an assistant that returns only valid JSON. Output a concise customization patch object with keys: colors, content, sections. Do not include markdown.'
const MODERATION_SYSTEM_PROMPT =
  'You are a strict template moderation assistant. Return only JSON with keys: decision, confidence, reasons, risks, suggested_feedback.'

async function callOpenAiJson(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`LLM request failed: ${response.status} ${errorText}`)
  }

  const payload = await response.json()
  const content = payload?.choices?.[0]?.message?.content
  const parsed = typeof content === 'string' ? extractJson(content) : null
  return parsed && typeof parsed === 'object' ? parsed : null
}

function fallbackPatch() {
  return {
    colors: {
      primary: '#0ea5e9',
      accent: '#10b981',
    },
    content: {
      hero_title: 'AI-updated hero copy',
    },
    sections: [],
  }
}

function extractJson(text: string) {
  const trimmed = text.trim()
  if (!trimmed) return null

  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start >= 0 && end > start) {
      const candidate = trimmed.slice(start, end + 1)
      try {
        return JSON.parse(candidate)
      } catch {
        return null
      }
    }
    return null
  }
}

export async function generateCustomizationPatch(prompt: string, currentConfig: Record<string, any>) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return { patch: fallbackPatch(), provider: 'fallback' }
  }

  const userPrompt = [
    'Generate a JSON customization patch for this template config.',
    `User request: ${prompt}`,
    `Current config JSON: ${JSON.stringify(currentConfig || {})}`,
    'Return strict JSON only with keys: colors, content, sections.',
  ].join('\n')

  const parsed = await callOpenAiJson(CUSTOMIZATION_SYSTEM_PROMPT, userPrompt)

  if (!parsed || typeof parsed !== 'object') {
    return { patch: fallbackPatch(), provider: 'fallback_parse' }
  }

  return { patch: parsed, provider: 'openai' }
}

export async function generateTemplateModerationSuggestion(template: {
  name: string
  category: string
  price: number
  description?: string
  demoUrl?: string
}) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      provider: 'fallback',
      result: {
        decision: 'manual_review',
        confidence: 0.3,
        reasons: ['No LLM key configured'],
        risks: ['Perform manual QA and security checks'],
        suggested_feedback: 'Run full manual review before approval.',
      },
    }
  }

  const userPrompt = [
    'Review this template submission and suggest moderation outcome.',
    `Template JSON: ${JSON.stringify(template)}`,
    'Return decision as one of: approve, reject, manual_review.',
    'Return strict JSON only.',
  ].join('\n')

  const parsed = await callOpenAiJson(MODERATION_SYSTEM_PROMPT, userPrompt)

  return {
    provider: 'openai',
    result:
      parsed && typeof parsed === 'object'
        ? parsed
        : {
            decision: 'manual_review',
            confidence: 0.4,
            reasons: ['Unable to parse model output'],
            risks: ['Fallback to manual moderation'],
          suggested_feedback: 'Manual review required.',
          },
  }
}

export async function generateSupportReplySuggestion(ticket: any, recentMessages: any[]) {
  const fallback = {
    priority: 'medium',
    draft_reply: 'Thanks for the details. I am reviewing your issue and will share next steps shortly.',
    suggested_status: 'in_progress',
  }

  if (!process.env.OPENAI_API_KEY) return { provider: 'fallback', result: fallback }

  const parsed = await callOpenAiJson(
    'You are a support assistant. Return only JSON with keys: priority, suggested_status, draft_reply, tags.',
    `Ticket: ${JSON.stringify(ticket)}\nRecent messages: ${JSON.stringify(recentMessages)}`
  )
  return { provider: 'openai', result: parsed || fallback }
}

export async function generateRefundReviewSuggestion(refund: any, purchase: any) {
  const fallback = {
    recommendation: 'manual_review',
    confidence: 0.4,
    reasoning: ['Insufficient context for automated decision'],
  }
  if (!process.env.OPENAI_API_KEY) return { provider: 'fallback', result: fallback }

  const parsed = await callOpenAiJson(
    'You are a refunds policy assistant. Return JSON with keys: recommendation, confidence, reasoning, suggested_note.',
    `Refund request: ${JSON.stringify(refund)}\nPurchase: ${JSON.stringify(purchase)}\nPolicy: 30-day guarantee with manual final approval.`
  )
  return { provider: 'openai', result: parsed || fallback }
}

export async function generateDiscoverySuggestions(query: string, templates: any[], signals: any = {}) {
  const fallback = {
    interpreted_query: query,
    recommended_template_ids: templates.slice(0, 3).map((t) => t.id),
    rationale: 'Using top templates as fallback recommendations.',
  }
  if (!process.env.OPENAI_API_KEY) return { provider: 'fallback', result: fallback }

  const parsed = await callOpenAiJson(
    'You are a marketplace discovery assistant. Return JSON: interpreted_query, recommended_template_ids (array), rationale.',
    `Query: ${query}\nTemplates: ${JSON.stringify(templates)}\nSignals: ${JSON.stringify(signals)}`
  )
  return { provider: 'openai', result: parsed || fallback }
}

export async function generateSubmissionAids(context: any) {
  const fallback = {
    listing_copy: {
      short_description: 'Production-ready template with clean architecture and fast setup.',
      long_description: 'A production-ready template built for fast launch, easy customization, and reliable performance.',
    },
    checklist: ['README is complete', 'Demo URL is working', 'No secrets committed'],
  }
  if (!process.env.OPENAI_API_KEY) return { provider: 'fallback', result: fallback }

  const parsed = await callOpenAiJson(
    'You are a developer listing assistant. Return JSON with listing_copy {short_description, long_description} and checklist (array).',
    `Submission context: ${JSON.stringify(context)}`
  )
  return { provider: 'openai', result: parsed || fallback }
}

export async function generateLaunchAssistantPlan(context: any) {
  const fallback = {
    plan_title: 'Launch plan',
    steps: ['Update branding', 'Set environment variables', 'Deploy and verify analytics', 'Run smoke tests'],
    risks: ['Missing environment variables', 'Payment webhook not configured'],
  }
  if (!process.env.OPENAI_API_KEY) return { provider: 'fallback', result: fallback }

  const parsed = await callOpenAiJson(
    'You are a launch assistant. Return JSON with plan_title, steps (array), risks (array), and optional timeline.',
    `Founder context: ${JSON.stringify(context)}`
  )
  return { provider: 'openai', result: parsed || fallback }
}
