'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Hash } from 'lucide-react'
import type { Channel } from '@/types'

export function ChannelList() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('channels')
        .select('*, client:clients(*)')
        .order('updated_at', { ascending: false })

      setChannels((data as Channel[]) || [])
      setLoading(false)
    }
    load()
  }, [supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (channels.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Hash className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No channels yet. Create one to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {channels.map((channel) => (
        <Link key={channel.id} href={`/dashboard/channels/${channel.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{channel.name}</h3>
                {channel.client && (
                  <Badge variant="secondary">{channel.client.company || channel.client.name}</Badge>
                )}
              </div>
              {channel.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{channel.description}</p>
              )}
              <p className="text-xs text-muted-foreground">Updated {formatDate(channel.updated_at)}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
