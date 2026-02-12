import { Badge } from '@/components/ui/badge'
import type { DocumentStatus } from '@/types'

const statusConfig: Record<DocumentStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  sent: { label: 'Sent', variant: 'default' },
  viewed: { label: 'Viewed', variant: 'outline' },
  signed: { label: 'Signed', variant: 'default' },
  expired: { label: 'Expired', variant: 'destructive' },
}

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const config = statusConfig[status] || statusConfig.draft
  return <Badge variant={config.variant}>{config.label}</Badge>
}
