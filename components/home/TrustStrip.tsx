import { Shield, Code, Lock } from 'lucide-react'

export function TrustStrip() {
  const trustPoints = [
    {
      icon: Code,
      text: 'Code stays with developers',
    },
    {
      icon: Shield,
      text: 'No code execution',
    },
    {
      icon: Lock,
      text: 'Clear customization boundaries',
    },
  ]

  return (
    <section className="py-12 bg-primary-50 border-y border-primary-100">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {trustPoints.map((point, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                <point.icon size={20} />
              </div>
              <span className="text-gray-900 font-medium">{point.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
