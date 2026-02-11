import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sitemap | Genix',
  description: 'Browse all major pages on Genix.',
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/for-developers', label: 'For Developers' },
  { href: '/developers/submit', label: 'Submit Template' },
  { href: '/trust', label: 'Trust & Safety' },
  { href: '/trust/code-ownership', label: 'Code Ownership' },
  { href: '/trust/how-previews-work', label: 'How Previews Work' },
  { href: '/trust/customization', label: 'Customization Limits' },
  { href: '/trust/support', label: 'Support & Refunds' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
  { href: '/login', label: 'Sign In' },
]

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
          <p className="text-lg text-gray-600 mb-8">Quick links to all primary pages.</p>

          <div className="card">
            <ul className="grid sm:grid-cols-2 gap-3">
              {links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-primary-700 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
