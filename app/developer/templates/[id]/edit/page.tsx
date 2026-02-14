import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireDeveloper } from '@/lib/require-developer'
import { EditTemplateForm } from '@/components/developer/EditTemplateForm'

export const dynamic = 'force-dynamic'

type EditTemplatePageProps = {
  params: Promise<{ id: string }>
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const { id } = await params
  const user = await requireDeveloper(`/developer/templates/${id}/edit`)
  const supabase = createClient()

  const { data: row, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .eq('developer_id', user.id)
    .maybeSingle()

  if (error || !row) notFound()

  const previewData = row.preview_data && typeof row.preview_data === 'object' ? row.preview_data : {}
  const techStack = previewData.tech_stack && typeof previewData.tech_stack === 'object' ? previewData.tech_stack : {}
  const consultation = previewData.consultation && typeof previewData.consultation === 'object' ? previewData.consultation : {}
  const support = previewData.support && typeof previewData.support === 'object' ? previewData.support : {}
  const setupGuide = previewData.setup_guide && typeof previewData.setup_guide === 'object' ? previewData.setup_guide : {}

  const initialData = {
    id: String(row.id),
    name: String(row.name || ''),
    shortDescription: String(previewData.summary || ''),
    longDescription: String(row.description || ''),
    category: String(row.category || ''),
    githubUrl: String(row.github_url || ''),
    demoUrl: String(row.demo_url || ''),
    price: Number(row.price || 0),
    features: Array.isArray(row.features) ? row.features.map((item: unknown) => String(item)) : [],
    database: String(techStack.database || ''),
    authentication: String(techStack.authentication || ''),
    paymentProvider: String(techStack.payment_provider || ''),
    otherTools: String(techStack.other_tools || ''),
    consultationAvailable: Boolean(consultation.enabled),
    consultationRate: Number(consultation.hourly_rate || 0),
    exclusivePurchaseAvailable: Boolean(row.exclusive_purchase_available),
    exclusivePrice: Number(row.exclusive_price || 0),
    supportPackageAvailable: Boolean(row.support_package_available),
    supportPackagePrice: Number(row.support_package_price || 0),
    supportEmail: String(support.email || ''),
    supportChannel: String(support.channel || ''),
    supportTimezone: String(support.timezone || ''),
    supportResponseSlaHours: Number(support.response_sla_hours || 24),
    supportDurationDays: Number(support.duration_days || 30),
    supportIncluded: String(support.included || ''),
    supportExcluded: String(support.excluded || ''),
    guideBackendSetup: String(setupGuide.backend_setup || ''),
    guideAuthSetup: String(setupGuide.auth_setup || ''),
    guidePaymentsSetup: String(setupGuide.payments_setup || ''),
    guideAiBillingSetup: String(setupGuide.ai_billing_setup || ''),
    guidePrivacySecurity: String(setupGuide.privacy_security || ''),
    guideDeploymentRunbook: String(setupGuide.deployment_runbook || ''),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Edit Template</h1>
          <p className="text-gray-600 mb-8">
            Updating an approved template will send it back to pending review.
          </p>
          <EditTemplateForm templateId={String(row.id)} initialData={initialData} />
        </div>
      </section>
    </div>
  )
}
