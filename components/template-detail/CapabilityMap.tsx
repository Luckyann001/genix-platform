import type { TemplateRecord } from '@/lib/template-catalog'

type CapabilityMapProps = {
  template: TemplateRecord
}

export function CapabilityMap({ template }: CapabilityMapProps) {
  return (
    <section className="pb-20 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl">
          <h2 className="text-3xl font-bold mb-3">Capability Map</h2>
          <p className="text-gray-600 mb-8">
            Clear boundaries for what is editable in this template.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card border-green-200">
              <h3 className="text-xl font-semibold text-green-700 mb-4">Editable</h3>
              <ul className="space-y-2 text-gray-700">
                {template.capability_map.editable.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>

            <div className="card border-red-200">
              <h3 className="text-xl font-semibold text-red-700 mb-4">Not Editable</h3>
              <ul className="space-y-2 text-gray-700">
                {template.capability_map.notEditable.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card mt-6">
            <h3 className="text-xl font-semibold mb-2">Developer Profile</h3>
            <p className="font-medium">{template.developer_name}</p>
            <p className="text-gray-600 mt-2">{template.developer_bio}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
