import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Genix',
  description: 'Get in touch with the Genix team for support, sales, or partnership inquiries.',
}

const contactTopics = [
  'Template support',
  'Purchase and billing',
  'Developer onboarding',
  'Partnerships and integrations',
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Contact</h1>
          <p className="text-lg text-gray-600 mb-8">
            Reach us for support, account questions, or partnership requests.
          </p>

          <div className="card space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">Best Way to Reach Us</h2>
              <p className="text-gray-700">
                Email <a className="text-primary-600 hover:underline" href="mailto:support@genix.so">support@genix.so</a>{' '}
                and include your account email plus template name or order ID if relevant.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Common Topics</h2>
              <ul className="space-y-2 text-gray-700">
                {contactTopics.map((topic) => (
                  <li key={topic}>- {topic}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Response Times</h2>
              <p className="text-gray-700">
                We typically respond within 1 business day for support inquiries.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
