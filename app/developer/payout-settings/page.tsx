import Link from 'next/link'
import { requireDeveloper } from '@/lib/require-developer'
import { PayoutSettingsForm } from '@/components/developer/PayoutSettingsForm'

export const dynamic = 'force-dynamic'

export default async function DeveloperPayoutSettingsPage() {
  await requireDeveloper('/developer/payout-settings')

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom max-w-3xl">
          <Link href="/developer" className="text-primary-600 hover:underline text-sm">
            Back to Developer Dashboard
          </Link>
          <h1 className="text-4xl font-bold mt-2 mb-6">Payout Settings</h1>

          <PayoutSettingsForm />
        </div>
      </section>
    </div>
  )
}
