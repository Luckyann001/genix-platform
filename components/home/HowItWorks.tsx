import { Search, Eye, Palette, ShoppingCart } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      number: '1',
      title: 'Browse real developer-built sites',
      description: 'Explore templates built by professional developers, organized by use case: SaaS, stores, portfolios.',
    },
    {
      icon: Eye,
      number: '2',
      title: 'Preview & understand capabilities',
      description: 'See exactly what you\'re getting with interactive previews and clear customization boundaries.',
    },
    {
      icon: Palette,
      number: '3',
      title: 'Customize safely',
      description: 'Change text, colors, images, and toggle sections without breaking code. Complex changes? Hire the creator.',
    },
    {
      icon: ShoppingCart,
      number: '4',
      title: 'Buy + deploy with support',
      description: 'Get repo access, deployment guide, and 30 days of support. Deploy to Vercel in minutes.',
    },
  ]

  return (
    <section className="section">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
            How Genix Works
          </h2>
          <p className="text-xl text-gray-600">
            Four simple steps from discovery to deployment
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent" />
              )}

              <div className="relative bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all">
                {/* Number badge */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="feature-icon mb-4 mt-4">
                  <step.icon size={24} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
