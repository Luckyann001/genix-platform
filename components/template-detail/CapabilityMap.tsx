import type { TemplateRecord } from '@/lib/templates'

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
            {template.support && (
              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <p className="font-medium text-gray-900">Support package terms</p>
                <p>Contact: {template.support.email || 'N/A'}</p>
                <p>Channel: {template.support.channel || 'N/A'}</p>
                <p>Timezone: {template.support.timezone || 'N/A'}</p>
                <p>
                  SLA: {template.support.response_sla_hours ? `${template.support.response_sla_hours}h` : 'N/A'} response ·{' '}
                  {template.support.duration_days ? `${template.support.duration_days} days` : 'N/A'} duration
                </p>
                {template.support.included && <p>Included: {template.support.included}</p>}
                {template.support.excluded && <p>Excluded: {template.support.excluded}</p>}
              </div>
            )}
          </div>

          {template.setup_guide && (
            <div className="card mt-6">
              <h3 className="text-xl font-semibold mb-3">Setup Guide</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <p className="font-medium text-gray-900">Backend setup</p>
                  <p>{template.setup_guide.backend_setup || 'Not provided yet.'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Authentication setup</p>
                  <p>{template.setup_guide.auth_setup || 'Not provided yet.'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Payments by region</p>
                  <p>{template.setup_guide.payments_setup || 'Not provided yet.'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">AI billing and tokens</p>
                  <p>{template.setup_guide.ai_billing_setup || 'Not provided yet.'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Privacy and security</p>
                  <p>{template.setup_guide.privacy_security || 'Not provided yet.'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Deployment runbook</p>
                  <p>{template.setup_guide.deployment_runbook || 'Not provided yet.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
