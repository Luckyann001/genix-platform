import { X, Check } from 'lucide-react'

export function WhyNotAI() {
  const comparison = [
    {
      feature: 'Code quality',
      ai: 'Generic, often broken',
      freelancer: 'Varies wildly',
      genix: 'Professional, tested',
    },
    {
      feature: 'Speed',
      ai: 'Instant but unusable',
      freelancer: 'Weeks to months',
      genix: 'Deploy in minutes',
    },
    {
      feature: 'Ownership',
      ai: 'Platform lock-in',
      freelancer: 'Usually yes',
      genix: 'Full ownership',
    },
    {
      feature: 'Support',
      ai: 'None',
      freelancer: 'If they respond',
      genix: '30 days + hire creator',
    },
    {
      feature: 'Price',
      ai: '$10-50/mo',
      freelancer: '$500-5000+',
      genix: '$200-500 one-time',
    },
  ]

  return (
    <section className="section bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
            Why Not AI? Why Not Freelancers?
          </h2>
          <p className="text-xl text-gray-600">
            Honest comparison — we're not trying to be everything
          </p>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200">
              <div className="p-4 font-semibold text-gray-900"></div>
              <div className="p-4 text-center">
                <div className="font-semibold text-gray-900">AI Generators</div>
                <div className="text-sm text-gray-600">Wix, Webflow AI, etc.</div>
              </div>
              <div className="p-4 text-center">
                <div className="font-semibold text-gray-900">Freelancers</div>
                <div className="text-sm text-gray-600">Upwork, Fiverr</div>
              </div>
              <div className="p-4 text-center bg-primary-50">
                <div className="font-semibold text-primary-900">Genix</div>
                <div className="text-sm text-primary-700">This platform</div>
              </div>
            </div>

            {/* Comparison Rows */}
            {comparison.map((row, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-4 ${index !== comparison.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <div className="p-4 font-medium text-gray-900">
                  {row.feature}
                </div>
                <div className="p-4 text-center text-sm text-gray-600">
                  {row.ai}
                </div>
                <div className="p-4 text-center text-sm text-gray-600">
                  {row.freelancer}
                </div>
                <div className="p-4 text-center text-sm bg-primary-50 font-medium text-primary-900">
                  {row.genix}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Note */}
          <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-amber-900">
              <span className="font-semibold">Honest note:</span> If you need a simple landing page, 
              AI tools might work. If you need complex custom software, hire a developer directly. 
              Genix is for founders who want quality + speed without the gamble.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
