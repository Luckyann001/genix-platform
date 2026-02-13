import Link from 'next/link'
import { ArrowRight, Sparkles, Bot, CreditCard, ShieldCheck } from 'lucide-react'

export function Hero() {
  return (
    <section className="section relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute -top-24 -left-20 w-80 h-80 bg-cyan-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-28 right-0 w-96 h-96 bg-emerald-500/20 blur-3xl rounded-full" />
      <div className="container-custom">
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-cyan-100 rounded-full text-sm font-medium mb-8 animate-fade-in border border-white/20">
            <Sparkles size={14} />
            AI SaaS launch infrastructure for fast-moving founders
          </div>

          <h1 className="text-5xl lg:text-7xl font-display font-bold mb-6 animate-slide-up">
            Launch production-ready{' '}
            <span className="text-cyan-300">AI SaaS</span>{' '}
            in days, not months.
          </h1>

          <p className="text-xl lg:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Verified full-stack Next.js kits with auth, billing, usage limits, and clear customization boundaries.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/templates" className="btn bg-cyan-400 text-slate-950 hover:bg-cyan-300 text-lg px-8 py-4 w-full sm:w-auto">
              Browse AI Launch Kits
              <ArrowRight size={20} />
            </Link>
            <Link href="/for-developers" className="btn bg-white/10 border border-white/25 text-white hover:bg-white/20 text-lg px-8 py-4 w-full sm:w-auto">
              For Developers
            </Link>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-slate-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900" />
                ))}
              </div>
              <span>Verified builder network</span>
            </div>
            <div className="w-px h-4 bg-slate-600" />
            <span>Founder-first roadmap</span>
            <div className="w-px h-4 bg-slate-600" />
            <span>Live customizable previews</span>
          </div>
        </div>

        <div className="mt-20 animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <div className="relative">
            <div className="bg-slate-900/70 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 mx-4 px-4 py-1.5 bg-slate-800 rounded-md text-sm text-slate-300">
                  genix.so/templates?category=ai-saas
                </div>
              </div>
              <div className="aspect-[16/10] bg-gradient-to-br from-slate-900 to-slate-800 p-8">
                <div className="grid grid-cols-3 gap-4 h-full">
                  <div className="bg-slate-900 rounded-lg border border-cyan-500/30 p-4 flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded mb-3 flex items-center justify-center">
                      <Bot className="text-cyan-300" />
                    </div>
                    <div className="text-xs font-semibold mb-1 text-white">AI Copilot SaaS Kit</div>
                    <div className="text-xs text-slate-400 mb-2">Usage limits + team auth</div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-bold text-cyan-300">$399</span>
                      <span className="text-xs text-emerald-300">verified</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-lg border border-emerald-500/30 p-4 flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded mb-3 flex items-center justify-center">
                      <CreditCard className="text-emerald-300" />
                    </div>
                    <div className="text-xs font-semibold mb-1 text-white">AI Billing Core</div>
                    <div className="text-xs text-slate-400 mb-2">Stripe subscriptions + webhooks</div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-300">$449</span>
                      <span className="text-xs text-emerald-300">production</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-lg border border-blue-500/30 p-4 flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded mb-3 flex items-center justify-center">
                      <ShieldCheck className="text-blue-300" />
                    </div>
                    <div className="text-xs font-semibold mb-1 text-white">AI Guardrails Kit</div>
                    <div className="text-xs text-slate-400 mb-2">Rate limiting + roles + audit</div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-300">$349</span>
                      <span className="text-xs text-emerald-300">trusted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -left-6 bg-slate-900 rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 animate-fade-in border border-slate-700" style={{ animationDelay: '0.6s' }}>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-bold">✓</div>
              <div className="text-sm">
                <div className="font-semibold text-white">Verified Launch Kit</div>
                <div className="text-slate-400">Auth, billing, docs included</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-slate-900 rounded-lg shadow-lg px-4 py-2 animate-fade-in border border-slate-700" style={{ animationDelay: '0.7s' }}>
              <div className="text-sm font-semibold text-slate-100 mb-1">Time to first deploy</div>
              <div className="text-2xl font-bold text-cyan-300">&lt; 1 day</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
