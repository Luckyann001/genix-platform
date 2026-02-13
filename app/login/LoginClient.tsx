"use client"

import { Github, Sparkles, ShieldCheck, Rocket, Users } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function LoginClient() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || ''
  const next = searchParams.get('next') || '/templates'

  const googleHref = `/api/auth/google?role=buyer&next=${encodeURIComponent(next)}`
  const githubHref = `/api/auth/github?role=developer&next=${encodeURIComponent(next)}`

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
              <p className="text-slate-600">
                {role === 'developer'
                  ? 'Sign in with GitHub to submit and manage your launch kits.'
                  : role === 'founder'
                    ? 'Sign in to continue browsing and buying AI launch kits.'
                    : "Choose how you'd like to sign in"}
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-3 flex items-center gap-2">
                  <Users size={14} />
                  For founders & buyers
                </p>
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
                  Continue with Google
                </button>
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
                <p className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-3 flex items-center gap-2">
                  <Rocket size={14} />
                  For developers
                </p>
                <button
                  onClick={() => {
                    window.location.href = githubHref
                  }}
                  className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-4 px-4 text-lg font-semibold flex items-center justify-center gap-3 transition-all"
                >
                  <Github size={22} />
                  Continue with GitHub
                </button>
              </div>
            </div>

            <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5 text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>Founders:</strong> Use Google to buy and customize templates</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-primary-600 mt-0.5 flex-shrink-0" />
                <span><strong>Developers:</strong> Use GitHub to sell your templates</span>
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
            <a href="/for-developers" className="text-sm text-cyan-300 hover:underline">For Developers</a>
          </div>
        </div>
      </div>
    </div>
  )
}
