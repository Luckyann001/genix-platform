import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { SubmitTemplateForm } from '@/components/submit/SubmitTemplateForm'

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

            <SubmitTemplateForm />
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
