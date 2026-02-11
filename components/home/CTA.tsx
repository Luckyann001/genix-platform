import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="section bg-gradient-to-br from-primary-600 to-accent-600 text-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6">
            Ready to launch your next project?
          </h2>
          <p className="text-xl lg:text-2xl text-primary-50 mb-10">
            Browse production-ready templates built by professional developers. 
            Deploy in minutes, not months.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/marketplace" className="btn bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-4 w-full sm:w-auto">
              Browse Templates
              <ArrowRight size={20} />
            </Link>
            <Link href="/for-developers" className="btn bg-primary-700/50 text-white border-2 border-white/20 hover:bg-primary-700 text-lg px-8 py-4 w-full sm:w-auto">
              I'm a Developer
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Professional developers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-primary-100">Production templates</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">~10min</div>
              <div className="text-primary-100">Average deploy time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
