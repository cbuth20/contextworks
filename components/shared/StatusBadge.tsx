import { Badge } from '@/components/ui/badge'
import type { DocumentStatus } from '@/types'

interface StatusBadgeProps {
  status: DocumentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variantMap: Record<DocumentStatus, 'draft' | 'sent' | 'viewed' | 'signed' | 'archived'> = {
    draft: 'draft',
    sent: 'sent',
    viewed: 'viewed',
    signed: 'signed',
    archived: 'archived',
  }

  const labelMap: Record<DocumentStatus, string> = {
    draft: 'Draft',
    sent: 'Sent',
    viewed: 'Viewed',
    signed: 'Signed',
    archived: 'Archived',
  }

  return (
    <Badge variant={variantMap[status]}>
      {labelMap[status]}
    </Badge>
  )
}
