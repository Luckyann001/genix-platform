import Link from 'next/link'
import { Shield, Code, Eye, Lock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trust & Safety | Genix',
  description: 'Learn how Genix handles code ownership, safe previews, customization boundaries, and support.',
}

const trustLinks = [
  {
    href: '/trust/code-ownership',
    title: 'Code Ownership',
    description: 'Who owns what after a purchase, licensing terms, and developer rights.',
    icon: Code,
  },
  {
    href: '/trust/how-previews-work',
    title: 'How Previews Work',
    description: 'How we generate template previews without executing code.',
    icon: Eye,
  },
  {
    href: '/trust/customization',
    title: 'Customization Limits',
    description: 'Exactly what can be customized before and after purchase.',
    icon: Lock,
  },
  {
    href: '/trust/support',
    title: 'Support & Refunds',
    description: 'Support windows, issue handling, and refund policy details.',
    icon: Shield,
  },
]

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Trust & Safety</h1>
            <p className="text-lg text-gray-600">
              Clear policies, transparent ownership, and secure workflows for buyers and developers.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-6">
            {trustLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card card-hover block"
              >
                <div className="feature-icon mb-4">
                  <item.icon size={22} />
                </div>
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
