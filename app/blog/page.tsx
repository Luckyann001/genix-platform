import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Genix',
  description: 'Product updates, launch guides, and marketplace insights from Genix.',
}

const upcomingPosts = [
  {
    title: 'How to Evaluate a Template Before You Buy',
    category: 'Buying Guide',
  },
  {
    title: 'Developer Checklist for Listing Production-Ready Templates',
    category: 'For Developers',
  },
  {
    title: 'Launch Faster: From Purchase to Production in One Weekend',
    category: 'Case Study',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-gray-600 mb-10">
            We are preparing practical guides and updates. First posts are coming soon.
          </p>

          <div className="grid gap-5">
            {upcomingPosts.map((post) => (
              <article key={post.title} className="card">
                <p className="text-sm text-primary-600 font-medium mb-2">{post.category}</p>
                <h2 className="text-xl font-semibold">{post.title}</h2>
              </article>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
