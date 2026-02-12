'use client'

import { useState, useCallback } from 'react'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ChannelList } from '@/components/dashboard/ChannelList'
import { CreateChannelDialog } from '@/components/dashboard/CreateChannelDialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function ChannelsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreated = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div>
      <DashboardHeader
        title="Channels"
        description="Manage client channels and workspaces"
        actions={
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Channel
          </Button>
        }
      />

      <ChannelList key={refreshKey} />

      <CreateChannelDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />
    </div>
  )
}
