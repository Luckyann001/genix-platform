import Link from 'next/link'
import { DollarSign, Code2, Shield, ArrowRight } from 'lucide-react'

export function ForDevelopers() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Turn side projects into income',
      description: 'Earn 70% revenue from template sales + 85% from consulting bookings.',
    },
    {
      icon: Code2,
      title: 'You keep full ownership',
      description: 'Your code stays yours. List anywhere. No exclusivity required.',
    },
    {
      icon: Shield,
      title: 'We never execute your code',
      description: 'Genix reads structure only. Your logic, APIs, and secrets stay private.',
    },
  ]

  return (
    <section className="section-sm">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <div className="relative lg:order-1">
            <div className="aspect-square bg-gradient-to-br from-accent-100 to-primary-100 rounded-2xl p-8 flex items-center justify-center">
              <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm w-full">
                <div className="mb-2">$ git push origin main</div>
                <div className="mb-2 text-gray-500">→ Analyzing structure...</div>
                <div className="mb-2 text-gray-500">→ Generating preview...</div>
                <div className="text-green-400">✓ Template listed on Genix</div>
                <div className="mt-4 text-blue-400">💰 Earnings: $450/month</div>
              </div>
            </div>

            {/* Floating stat */}
            <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-xl p-4">
              <div className="text-sm text-gray-600 mb-1">Average earnings</div>
              <div className="text-3xl font-bold text-primary-600">$450</div>
              <div className="text-xs text-gray-500">per template/month</div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:order-2">
            <div className="inline-block px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-6">
              For Developers
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Monetize your real work
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              You build great projects. We help you sell them. Keep ownership, 
              earn passively, and get consulting gigs.
            </p>

            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center">
                    <benefit.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/for-developers" className="btn btn-primary">
                Learn More
                <ArrowRight size={20} />
              </Link>
              <Link href="/submit" className="btn btn-secondary">
                Submit Template
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
