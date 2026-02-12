'use client'

import { DocumentDetail } from '@/components/dashboard/DocumentDetail'

export default function DocumentPage({ params }: { params: { id: string; docId: string } }) {
  return <DocumentDetail documentId={params.docId} channelId={params.id} />
}
