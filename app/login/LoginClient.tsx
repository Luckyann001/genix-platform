"use client"

import { FormEvent, useState } from 'react'
import { Sparkles, ShieldCheck, Users } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function LoginClient() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/templates'
  const [mode, setMode] = useState<'signup' | 'signin'>('signup')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'idle' | 'success' | 'error'; text: string }>({
    type: 'idle',
    text: '',
  })

  const googleHref = `/api/auth/google?next=${encodeURIComponent(next)}`

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: 'idle', text: '' })

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')

    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          name,
          email,
          password,
          next,
        }),
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || 'Authentication failed')
      }

      const requiresEmailVerification = Boolean(payload?.data?.requiresEmailVerification)
      const nextPath = String(payload?.data?.next || '')

      if (requiresEmailVerification) {
        setMessage({
          type: 'success',
          text: 'Account created. Check your email to verify your account, then sign in.',
        })
        return
      }

      if (nextPath) {
        window.location.href = nextPath
        return
      }

      window.location.href = '/templates'
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: String(error?.message || 'Authentication failed'),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex items-center justify-center py-14 px-4">
      <div className="absolute -top-20 -left-24 w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-28 w-80 h-80 rounded-full bg-accent-500/20 blur-3xl" />

      <div className="max-w-lg w-full relative">
        <div className="rounded-[28px] border border-white/15 bg-white/10 backdrop-blur-xl p-2 shadow-[0_24px_70px_rgba(2,6,23,0.55)]">
          <div className="rounded-[22px] bg-white p-8 md:p-9">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 mb-4">
                <Sparkles size={14} />
                Secure account access
              </div>

              <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">Welcome to Genix</h1>
              <p className="text-slate-600">Buyer onboarding only. Create your account or sign in to continue.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Create account
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Sign in
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-3 flex items-center gap-2">
                  <Users size={14} />
                  For buyers
                </p>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                      <input name="name" type="text" className="input" placeholder="Your full name" required />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gmail</label>
                    <input name="email" type="email" className="input" placeholder="you@gmail.com" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input name="password" type="password" className="input" minLength={8} required />
                  </div>

                  <button type="submit" className="w-full btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Create buyer account' : 'Sign in as buyer'}
                  </button>
                </form>
              </div>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-slate-400 uppercase tracking-wide">or</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <button
                  onClick={() => {
                    window.location.href = googleHref
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 py-4 px-4 text-lg font-semibold flex items-center justify-center gap-3 transition-all"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>
              </div>

              {message.type !== 'idle' && (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${
                    message.type === 'success'
                      ? 'border-green-300 bg-green-50 text-green-800'
                      : 'border-red-300 bg-red-50 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>

            <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>Buyers:</strong> Use Gmail + password or Google to buy and customize templates</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-primary-600 mt-0.5 flex-shrink-0" />
                <span><strong>Developers:</strong> Start onboarding when you click submit template</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-accent-600 mt-0.5 flex-shrink-0" />
                <span>No credit card required to browse templates</span>
              </div>
            </div>

            <p className="mt-6 text-xs text-center text-slate-500">
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-primary-700 hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary-700 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>

        <div className="mt-7 text-center">
          <p className="text-sm text-slate-300 mb-3">New to Genix?</p>
          <div className="flex gap-4 justify-center">
            <a href="/how-it-works" className="text-sm text-cyan-300 hover:underline">How It Works</a>
            <a href="/developers/submit" className="text-sm text-cyan-300 hover:underline">Submit Template</a>
          </div>
        </div>
      </div>
    </div>
  )
}
