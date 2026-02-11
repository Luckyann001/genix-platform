export function ValueProposition() {
  const pillars = [
    {
      title: 'Production-ready templates',
      description: 'Ship-ready code built by experienced developers, not generated boilerplate.',
    },
    {
      title: 'Transparent capabilities',
      description: 'Every listing includes clear customization boundaries before purchase.',
    },
    {
      title: 'Faster launch cycle',
      description: 'Go from selection to deployment quickly with trusted template foundations.',
    },
  ]

  return (
    <section className="section-sm bg-white">
      <div className="container-custom">
        <div className="max-w-3xl mb-12">
          <h2 className="text-4xl font-bold mb-4">Why founders choose Genix</h2>
          <p className="text-lg text-gray-600">
            Reliable website foundations that reduce launch risk and time to market.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="card">
              <h3 className="text-xl font-semibold mb-2">{pillar.title}</h3>
              <p className="text-gray-600">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
