import { Search } from 'lucide-react'

export function MarketplaceHero() {
  return (
    <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6">
            Production-Ready Templates
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Built by professional developers. Deploy in minutes. Full ownership guaranteed.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search templates... (e.g., 'SaaS dashboard', 'e-commerce')"
              className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-lg"
            />
          </div>

          {/* Quick Stats */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-600">100+ templates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-gray-600">50+ developers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-gray-600">Next.js 14</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
