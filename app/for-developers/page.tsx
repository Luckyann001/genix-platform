import Link from 'next/link'
import type { Metadata } from 'next'
import { DollarSign, Code2, Shield, TrendingUp, Clock, Users, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'For Developers - Monetize Your Work | Genix',
  description: 'Turn your projects into income. Earn 70% from sales + 85% from consulting bookings.',
}

export default function ForDevelopersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-accent-600 to-primary-600 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6">
              Monetize Your Real Work
            </h1>
            <p className="text-xl lg:text-2xl text-primary-50 mb-10">
              You build great projects. We help you sell them. Keep ownership, 
              earn passively, and get consulting gigs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/developers/submit" className="btn bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-4">
                Submit Template
                <ArrowRight size={20} />
              </Link>
              <Link href="#how-it-works" className="btn bg-primary-700/50 border-2 border-white/20 hover:bg-primary-700 text-lg px-8 py-4">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">70%</div>
              <div className="text-xl font-semibold mb-2">Template Sales</div>
              <div className="text-gray-600">You keep majority of revenue</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent-600 mb-2">85%</div>
              <div className="text-xl font-semibold mb-2">Consulting Fees</div>
              <div className="text-gray-600">From hourly bookings</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">$450</div>
              <div className="text-xl font-semibold mb-2">Avg. per Month</div>
              <div className="text-gray-600">Per template</div>
            </div>
          </div>

          <div className="bg-primary-50 rounded-2xl p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Revenue Example</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4">Template Sales</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Template price:</span>
                    <span className="font-semibold">$299</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your share (70%):</span>
                    <span className="font-semibold text-green-600">$209</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform fee (30%):</span>
                    <span className="text-gray-500">$90</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-bold">
                      <span>5 sales/month:</span>
                      <span className="text-green-600">$1,045</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4">Consulting</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Your rate:</span>
                    <span className="font-semibold">$150/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your share (85%):</span>
                    <span className="font-semibold text-green-600">$127.50/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform fee (15%):</span>
                    <span className="text-gray-500">$22.50/hr</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-bold">
                      <span>10 hours/month:</span>
                      <span className="text-green-600">$1,275</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <div className="text-4xl font-bold text-primary-600">$2,320/month</div>
              <div className="text-gray-600 mt-2">Potential monthly income from one template</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-gray-50" id="how-it-works">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-16">Why List on Genix?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mb-4">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Passive Income</h3>
              <p className="text-gray-600">
                Earn while you sleep. One template can generate recurring revenue 
                for years.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Code2 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Ownership</h3>
              <p className="text-gray-600">
                Your code stays yours. List anywhere. No exclusivity. We just help you sell.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Code Security</h3>
              <p className="text-gray-600">
                We never execute your code. Only read structure for previews. Your secrets stay safe.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Consulting Gigs</h3>
              <p className="text-gray-600">
                Get booked for customization work. Set your own rates. Recurring clients.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Setup</h3>
              <p className="text-gray-600">
                Connect GitHub, fill template form, publish. Takes under 10 minutes.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Buyer Support</h3>
              <p className="text-gray-600">
                We handle payments, delivery, and initial support. You focus on building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-16">How to Get Started</h2>
          
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Connect GitHub</h3>
                <p className="text-gray-600 mb-4">
                  Sign in with GitHub. We'll access only the repos you want to list. 
                  Your code stays private until purchase.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Submit Template</h3>
                <p className="text-gray-600 mb-4">
                  Fill out template details: name, description, category, pricing, 
                  customization boundaries. Add screenshots and demo link.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">We Review & Approve</h3>
                <p className="text-gray-600 mb-4">
                  Our team reviews for quality (usually 24-48 hours). We verify: 
                  code runs, docs are clear, no security issues.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Go Live & Earn</h3>
                <p className="text-gray-600 mb-4">
                  Template goes live on marketplace. Get sales notifications. 
                  Weekly payouts to your account. Track analytics in dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-16">Template Requirements</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-8 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-green-600">✓ Must Have</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Next.js 14+ (for now, other frameworks coming soon)</li>
                  <li>• Clear README with setup instructions</li>
                  <li>• Working demo deployed somewhere (Vercel, Netlify, etc.)</li>
                  <li>• No security vulnerabilities</li>
                  <li>• Production-ready code quality</li>
                  <li>• Original work (not copied from tutorials)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 text-blue-600">✓ Nice to Have</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• TypeScript</li>
                  <li>• Comprehensive documentation</li>
                  <li>• Environment variable examples</li>
                  <li>• Video walkthrough</li>
                  <li>• Test coverage</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 text-red-600">✗ Not Allowed</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Copied code from other templates</li>
                  <li>• Broken features or incomplete implementations</li>
                  <li>• Security issues (hardcoded secrets, SQL injection, etc.)</li>
                  <li>• Malicious code</li>
                  <li>• Templates that violate copyrights</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-primary-50 mb-10 max-w-2xl mx-auto">
            Join 50+ developers already making passive income on Genix. 
            List your first template in under 10 minutes.
          </p>
          <Link href="/developers/submit" className="btn bg-white text-primary-600 hover:bg-gray-50 text-lg px-10 py-4 inline-flex items-center gap-2">
            Submit Your Template
            <ArrowRight size={20} />
          </Link>
          <p className="mt-6 text-primary-100 text-sm">
            Questions? Email <a href="mailto:developers@genix.so" className="underline">developers@genix.so</a>
          </p>
        </div>
      </section>
    </div>
  )
}
