import { LaunchClient } from './LaunchClient'

export const dynamic = 'force-dynamic'

type LaunchPageProps = {
  params: {
    purchaseId: string
  }
}

export default function LaunchPage({ params }: LaunchPageProps) {
  return <LaunchClient purchaseId={params.purchaseId} />
}
