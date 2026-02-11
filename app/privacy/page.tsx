import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Genix',
  description: 'How Genix collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl p-8 lg:p-12">
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: February 11, 2026</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
              <p>
                We collect account information, purchase and transaction data, support messages,
                and basic analytics needed to operate and improve the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">How We Use Data</h2>
              <p>
                Data is used to process purchases, authenticate users, provide support, detect abuse,
                and communicate essential account or product updates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Data Sharing</h2>
              <p>
                We only share data with service providers needed to deliver the service, including
                payment processors and authentication providers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
              <p>
                You can request access, correction, or deletion of your personal data by contacting
                our support team.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Contact</h2>
              <p>
                For privacy requests, visit the contact page and include the subject line
                &quot;Privacy Request&quot;.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
