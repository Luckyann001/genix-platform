import Link from 'next/link'
import { Zap, Shield, Users, ArrowRight } from 'lucide-react'

export function ForFounders() {
  const benefits = [
    {
      icon: Zap,
      title: 'Launch with production defaults',
      description: 'Start from full-stack foundations instead of rebuilding auth, billing, and guardrails from scratch.',
    },
    {
      icon: Shield,
      title: 'Buy with clarity, not guesswork',
      description: 'Review live preview behavior and explicit customization limits before purchase.',
    },
    {
      icon: Users,
      title: 'Escalate to the original builder',
      description: 'If you need deeper product work, the developer who built the kit can support extensions.',
    },
  ]

  return (
    <section className="section-sm">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              For Founders
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              Build faster than teams that start from zero.
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Genix helps you ship AI SaaS faster with verified launch kits and clear operational boundaries.
            </p>

            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                    <benefit.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/templates" className="btn btn-primary">
              Browse AI Launch Kits
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6">
                  G
                </div>
                <p className="text-gray-600 font-medium">
                  [Founder success story visual]
                </p>
              </div>
            </div>

            {/* Floating testimonial */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6 max-w-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-lg">
                  LA
                </div>
                <div>
                  <div className="font-semibold">LuckyAnn</div>
                  <div className="text-sm text-gray-600">Founder @ TechStartup</div>
                </div>
              </div>
                <p className="text-sm text-gray-600">
                "We used Genix to skip months of setup work and focused on acquisition from day one."
                </p>
              </div>
            </div>
        </div>
      </div>
    </section>
  )
}
