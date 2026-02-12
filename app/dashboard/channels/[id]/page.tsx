'use client'

import { ChannelWorkspace } from '@/components/dashboard/ChannelWorkspace'

export default function ChannelPage({ params }: { params: { id: string } }) {
  return <ChannelWorkspace channelId={params.id} />
}
