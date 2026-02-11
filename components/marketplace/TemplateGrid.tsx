import Link from 'next/link'
import { ExternalLink, User } from 'lucide-react'

// Sample template data (would come from database in production)
const templates = [
  {
    id: 1,
    name: 'SaaS Starter Pro',
    description: 'Complete SaaS template with authentication, billing, and dashboard',
    price: 299,
    category: 'SaaS',
    developer: {
      name: 'Alex Rivera',
      avatar: null,
      verified: true,
    },
    features: ['Authentication', 'Stripe', 'Dashboard', 'Dark Mode'],
    image: null,
  },
  {
    id: 2,
    name: 'Modern Portfolio',
    description: 'Clean portfolio template with blog and project showcase',
    price: 149,
    category: 'Portfolio',
    developer: {
      name: 'Sarah Chen',
      avatar: null,
      verified: true,
    },
    features: ['Blog', 'MDX', 'Animations', 'SEO'],
    image: null,
  },
  {
    id: 3,
    name: 'E-commerce Starter',
    description: 'Full-featured store with product management and checkout',
    price: 399,
    category: 'E-commerce',
    developer: {
      name: 'Mike Johnson',
      avatar: null,
      verified: true,
    },
    features: ['Products', 'Cart', 'Checkout', 'Admin'],
    image: null,
  },
  {
    id: 4,
    name: 'Landing Page Kit',
    description: 'High-converting landing pages with A/B testing ready',
    price: 99,
    category: 'Landing',
    developer: {
      name: 'Emma Davis',
      avatar: null,
      verified: true,
    },
    features: ['Responsive', 'Fast', 'Analytics', 'Forms'],
    image: null,
  },
  {
    id: 5,
    name: 'Directory Platform',
    description: 'Build directories like Product Hunt or Indie Hackers',
    price: 349,
    category: 'SaaS',
    developer: {
      name: 'James Wilson',
      avatar: null,
      verified: true,
    },
    features: ['Listings', 'Search', 'Comments', 'Upvotes'],
    image: null,
  },
  {
    id: 6,
    name: 'Dashboard Admin',
    description: 'Beautiful admin dashboard with charts and tables',
    price: 249,
    category: 'SaaS',
    developer: {
      name: 'Lisa Anderson',
      avatar: null,
      verified: true,
    },
    features: ['Charts', 'Tables', 'Forms', 'Responsive'],
    image: null,
  },
]

export function TemplateGrid() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">All Templates</h2>
          <p className="text-gray-600 mt-1">{templates.length} templates found</p>
        </div>
        <select className="px-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200">
          <option>Most Popular</option>
          <option>Newest</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <Link
            key={template.id}
            href={`/template/${template.id}`}
            className="card card-hover group"
          >
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto">
                  {template.name.charAt(0)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              {/* Category Badge */}
              <div className="inline-block px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium mb-3">
                {template.category}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                {template.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {template.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {template.features.slice(0, 3).map((feature, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {feature}
                  </span>
                ))}
                {template.features.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    +{template.features.length - 3} more
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                {/* Developer */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{template.developer.name}</span>
                      {template.developer.verified && (
                        <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${template.price}</div>
                  <div className="text-xs text-gray-600">one-time</div>
                </div>
              </div>
            </div>

            {/* Hover Preview Button */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="btn btn-secondary btn-sm">
                <ExternalLink size={16} />
                Preview
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-12 text-center">
        <button className="btn btn-secondary">
          Load More Templates
        </button>
      </div>
    </div>
  )
}
