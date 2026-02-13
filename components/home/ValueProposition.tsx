export function ValueProposition() {
  const pillars = [
    {
      title: 'AI-SaaS-ready architecture',
      description: 'Each kit is structured for real products with auth, billing, and deployment docs.',
    },
    {
      title: 'Safe buyer customization',
      description: 'Buyers can edit text, fonts, and images through clear boundaries without breaking core logic.',
    },
    {
      title: 'Launch-speed economics',
      description: 'Reduce build time from months to days and spend budget on growth instead of basic plumbing.',
    },
  ]

  return (
    <section className="section-sm bg-slate-950 text-white">
      <div className="container-custom">
        <div className="max-w-3xl mb-12">
          <h2 className="text-4xl font-bold mb-4">Built for Founder Velocity</h2>
          <p className="text-lg text-slate-300">
            Genix is positioned as launch infrastructure, not a generic theme directory.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-semibold mb-2">{pillar.title}</h3>
              <p className="text-slate-300">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
