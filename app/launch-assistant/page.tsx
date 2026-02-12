import Link from 'next/link'
import { requireAuth } from '@/lib/require-auth'
import { LaunchAssistantPanel } from '@/components/founder/LaunchAssistantPanel'

export const dynamic = 'force-dynamic'

export default async function LaunchAssistantPage() {
  await requireAuth('/launch-assistant')

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="section-sm">
        <div className="container-custom max-w-3xl">
          <Link href="/templates" className="text-primary-600 hover:underline text-sm">
            Back to Templates
          </Link>
          <h1 className="text-4xl font-bold mt-2 mb-6">Founder Launch Assistant</h1>
          <LaunchAssistantPanel />
        </div>
      </section>
    </div>
  )
}
