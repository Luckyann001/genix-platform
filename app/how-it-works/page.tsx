import { Search, Eye, Palette, ShoppingCart, Code, CheckCircle, MessageSquare, Download } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works | Genix',
  description: 'Learn how Genix helps you buy and sell production-ready website templates',
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6">
              How Genix Works
            </h1>
            <p className="text-xl text-gray-600">
              A simple, transparent process for buying and selling production-ready website templates
            </p>
          </div>
        </div>
      </section>

      {/* For Buyers */}
      <section className="section bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-4">For Founders & Buyers</h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Get production-ready websites in minutes, not months
          </p>

          <div className="max-w-5xl mx-auto space-y-16">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-2xl font-bold">Browse Templates</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Explore our curated marketplace of professional templates. Filter by category 
                  (SaaS, E-commerce, Portfolio), price, and features. Each template is built 
                  by a verified developer.
                </p>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <Search size={20} className="flex-shrink-0 text-primary-600 mt-0.5" />
                  <span>Use search and filters to find exactly what you need</span>
                </div>
              </div>
              <div className="order-1 lg:order-2 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="w-full aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded mb-2" />
                        <div className="h-2 bg-gray-200 rounded mb-1" />
                        <div className="h-2 bg-gray-100 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-sm">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="flex-1 h-8 bg-primary-100 rounded flex items-center justify-center">
                      <Eye size={16} className="text-primary-600" />
                    </div>
                    <div className="flex-1 h-8 bg-green-100 rounded flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-2xl font-bold">Preview & Understand</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  View interactive previews that show the template's structure and capabilities. 
                  See exactly what you're getting: pages, components, features, and customization 
                  boundaries.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <Eye size={20} className="flex-shrink-0 text-primary-600 mt-0.5" />
                    <span>Interactive preview shows structure without executing code</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle size={20} className="flex-shrink-0 text-primary-600 mt-0.5" />
                    <span>Clear documentation of what you can customize</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-2xl font-bold">Customize Safely</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Before buying, customize text, colors, and images to see how it looks for 
                  your brand. Complex changes? Book the developer for customization work.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <Palette size={20} className="flex-shrink-0 text-primary-600 mt-0.5" />
                    <span>Change colors, fonts, and visual elements</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <MessageSquare size={20} className="flex-shrink-0 text-primary-600 mt-0.5" />
                    <span>Contact developer directly for custom features</span>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-sm">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded" />
                      <div className="w-12 h-12 bg-green-500 rounded" />
                      <div className="w-12 h-12 bg-purple-500 rounded" />
                    </div>
                    <div className="space-y-2">
                      <input type="text" className="w-full h-8 rounded border px-2 text-xs" placeholder="Edit text..." />
                      <div className="h-6 bg-gray-100 rounded" />
                      <div className="h-6 bg-gray-100 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 aspect-square flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-sm">
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingCart size={24} className="text-primary-600" />
                    <span className="text-2xl font-bold">$299</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Full source code</span>
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span>Deployment guide</span>
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span>30-day support</span>
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <div className="flex justify-between">
                      <span>Developer contact</span>
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 h-10 bg-primary-600 rounded flex items-center justify-center text-white font-semibold">
                    Purchase
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                    4
                  </div>
                  <h3 className="text-2xl font-bold">Buy & Deploy</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Secure checkout via Stripe. Instantly get repo access, deployment guide, 
                  and developer contact. Most sites deploy in under an hour. 30-day money-back 
                  guarantee.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <Download size={20} className="flex-shrink-0 text-primary-600 mt-0.5" />
                    <span>Immediate access to full source code</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <Code size={20} className="flex-shrink-0 text-primary-600 mt-0.5" />
                    <span>Deploy to Vercel, Netlify, or your own server</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <MessageSquare size={20} className="flex-shrink-0 text-primary-600 mt-0.5" />
                    <span>Direct developer support for 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-16">Your Protection</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Code Ownership</h3>
              <p className="text-gray-600 text-sm">
                You own the code outright. MIT licensed. Use however you want.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart size={32} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">30-Day Guarantee</h3>
              <p className="text-gray-600 text-sm">
                Not satisfied? Full refund within 30 days, no questions asked.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Direct Support</h3>
              <p className="text-gray-600 text-sm">
                Contact developer directly. Get help deploying and customizing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}