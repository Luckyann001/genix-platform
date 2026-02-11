import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

export function Hero() {
  return (
    <section className="section bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></span>
            Built by real developers, not AI
          </div>

          {/* Headline */}
          <h1 className="text-5xl lg:text-7xl font-display font-bold mb-6 animate-slide-up">
            Buy production-ready websites{' '}
            <span className="gradient-text">built by real developers</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Preview, customize, and launch — without gambling on AI or freelancers
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/marketplace" className="btn btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              Browse Templates
              <ArrowRight size={20} />
            </Link>
            <button className="btn btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
              <Play size={20} />
              Watch Demo
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                ))}
              </div>
              <span>50+ developers</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <span>⚡ Deploy in minutes</span>
            <div className="w-px h-4 bg-gray-300" />
            <span>✓ 30-day guarantee</span>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-20 animate-scale-in" style={{ animationDelay: '0.4s' }}>
          <div className="relative">
            {/* Browser mockup */}
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Browser chrome */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 mx-4 px-4 py-1.5 bg-white rounded-md text-sm text-gray-600">
                  genix.so/marketplace
                </div>
              </div>
              {/* Content area - Marketplace preview grid */}
              <div className="aspect-[16/10] bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                <div className="grid grid-cols-3 gap-4 h-full">
                  {/* Template card 1 */}
                  <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded mb-3 flex items-center justify-center">
                      <span className="text-3xl">🚀</span>
                    </div>
                    <div className="text-xs font-semibold mb-1">SaaS Starter</div>
                    <div className="text-xs text-gray-500 mb-2">Complete SaaS template</div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-bold">$299</span>
                      <span className="text-xs text-green-600">⭐ 4.8</span>
                    </div>
                  </div>
                  
                  {/* Template card 2 */}
                  <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-green-100 to-teal-100 rounded mb-3 flex items-center justify-center">
                      <span className="text-3xl">🛒</span>
                    </div>
                    <div className="text-xs font-semibold mb-1">E-commerce Pro</div>
                    <div className="text-xs text-gray-500 mb-2">Full store template</div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-bold">$399</span>
                      <span className="text-xs text-green-600">⭐ 4.9</span>
                    </div>
                  </div>
                  
                  {/* Template card 3 */}
                  <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-pink-100 to-orange-100 rounded mb-3 flex items-center justify-center">
                      <span className="text-3xl">💼</span>
                    </div>
                    <div className="text-xs font-semibold mb-1">Portfolio Site</div>
                    <div className="text-xs text-gray-500 mb-2">Modern portfolio</div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-bold">$149</span>
                      <span className="text-xs text-green-600">⭐ 5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-6 -left-6 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                ✓
              </div>
              <div className="text-sm">
                <div className="font-semibold">Verified</div>
                <div className="text-gray-600">Production-ready</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg px-4 py-2 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="text-sm font-semibold text-gray-900 mb-1">Deploy Time</div>
              <div className="text-2xl font-bold text-primary-600">~10 min</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
