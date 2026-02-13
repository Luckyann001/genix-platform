import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="section bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6">
            Ready to launch your AI SaaS?
          </h2>
          <p className="text-xl lg:text-2xl text-slate-200 mb-10">
            Start from verified full-stack kits and ship a real product faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/templates" className="btn bg-cyan-400 text-slate-950 hover:bg-cyan-300 text-lg px-8 py-4 w-full sm:w-auto">
              Browse AI Launch Kits
              <ArrowRight size={20} />
            </Link>
            <Link href="/for-developers" className="btn bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 text-lg px-8 py-4 w-full sm:w-auto">
              I'm a Developer
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold mb-2">AI-first</div>
              <div className="text-slate-300">category focus</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">Verified</div>
              <div className="text-slate-300">launch-ready kits</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">&lt; 1 day</div>
              <div className="text-slate-300">to first deployment</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
