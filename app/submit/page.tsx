import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Submit Template | Genix',
  description: 'Submit your Next.js template to Genix marketplace',
}

export default function SubmitTemplatePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-12">
        <Link href="/for-developers" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8">
          <ArrowLeft size={20} />
          Back to For Developers
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 lg:p-12">
            <h1 className="text-4xl font-bold mb-4">Submit Your Template</h1>
            <p className="text-gray-600 mb-8">
              Fill out the form below to list your template on Genix. We'll review it within 24-48 hours.
            </p>

            <form className="space-y-6">
              {/* Basic Info */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., SaaS Starter Pro"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Short Description * (Max 160 chars)
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Brief description for marketplace listing"
                      maxLength={160}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Long Description *
                    </label>
                    <textarea
                      className="input min-h-[150px]"
                      placeholder="Detailed description, features, use cases..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category *
                    </label>
                    <select className="input" required>
                      <option value="">Select category</option>
                      <option value="saas">SaaS</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="portfolio">Portfolio</option>
                      <option value="landing">Landing Page</option>
                      <option value="directory">Directory</option>
                      <option value="blog">Blog</option>
                      <option value="dashboard">Dashboard</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="pt-6 border-t">
                <h2 className="text-xl font-semibold mb-4">Links</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      GitHub Repository URL *
                    </label>
                    <input
                      type="url"
                      className="input"
                      placeholder="https://github.com/username/repo"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Must be a public repository
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Live Demo URL *
                    </label>
                    <input
                      type="url"
                      className="input"
                      placeholder="https://demo.vercel.app"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="pt-6 border-t">
                <h2 className="text-xl font-semibold mb-4">Pricing</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price (USD) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        className="input pl-8"
                        placeholder="299"
                        min="0"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      You'll receive 70% of sales revenue
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="pt-6 border-t">
                <h2 className="text-xl font-semibold mb-4">Features & Tech Stack</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Key Features (comma separated) *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Authentication, Stripe Integration, Admin Dashboard, Email Templates"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Database
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., Supabase, PostgreSQL"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Authentication
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., NextAuth, Supabase Auth"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Payment Provider
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., Stripe, PayPal"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Other Tools
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., Resend, Tailwind CSS"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Consulting */}
              <div className="pt-6 border-t">
                <h2 className="text-xl font-semibold mb-4">Consulting (Optional)</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">I'm available for consulting work on this template</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Hourly Rate (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        className="input pl-8"
                        placeholder="150"
                        min="0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">/hour</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      You'll receive 85% of consulting fees
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="pt-6 border-t">
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" required />
                  <span className="text-sm text-gray-600">
                    I confirm that this is my original work, the code is production-ready, 
                    and I have the rights to sell it. I agree to provide 30 days of basic 
                    support to buyers.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className="pt-6">
                <button type="submit" className="btn btn-primary w-full text-lg py-4">
                  Submit for Review
                </button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  We'll review your template within 24-48 hours and notify you via email
                </p>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li>1. We'll review your template for quality and security</li>
              <li>2. You'll receive an email with approval or feedback</li>
              <li>3. Once approved, your template goes live on the marketplace</li>
              <li>4. You'll start receiving sales and can track analytics in your dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}