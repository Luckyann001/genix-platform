import { CustomizeClient } from './CustomizeClient'

export const metadata = {
  title: 'Customize Template | Genix',
  description: 'Customize your purchased template',
}

export const dynamic = 'force-dynamic'

type CustomizePageProps = {
  params: {
    templateId: string
  }
  searchParams: {
    purchase?: string | string[]
  }
}

function firstParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] || ''
  return value || ''
}

export default function CustomizePage({ params, searchParams }: CustomizePageProps) {
  const purchaseId = firstParam(searchParams.purchase).trim() || null
  return <CustomizeClient templateId={params.templateId} purchaseId={purchaseId} />
}
