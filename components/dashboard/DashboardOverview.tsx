'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import { Hash, FileText, CheckCircle, Clock } from 'lucide-react'
import type { DocumentEvent } from '@/types'

interface Stats {
  channels: number
  documents: number
  signed: number
  pending: number
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({ channels: 0, documents: 0, signed: 0, pending: 0 })
  const [recentEvents, setRecentEvents] = useState<(DocumentEvent & { document_name?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [channelRes, docRes, signedRes, pendingRes, eventsRes] = await Promise.all([
        supabase.from('channels').select('id', { count: 'exact', head: true }),
        supabase.from('documents').select('id', { count: 'exact', head: true }),
        supabase.from('documents').select('id', { count: 'exact', head: true }).eq('status', 'signed'),
        supabase.from('documents').select('id', { count: 'exact', head: true }).in('status', ['sent', 'viewed']),
        supabase.from('document_events').select('*, documents(name)').order('created_at', { ascending: false }).limit(10),
      ])

      setStats({
        channels: channelRes.count || 0,
        documents: docRes.count || 0,
        signed: signedRes.count || 0,
        pending: pendingRes.count || 0,
      })

      const events = (eventsRes.data || []).map((e: Record<string, unknown>) => ({
        ...e,
        document_name: (e.documents as Record<string, unknown>)?.name,
      })) as (DocumentEvent & { document_name?: string })[]
      setRecentEvents(events)
      setLoading(false)
    }
    load()
  }, [supabase])

  const statCards = [
    { label: 'Channels', value: stats.channels, icon: Hash },
    { label: 'Documents', value: stats.documents, icon: FileText },
    { label: 'Signed', value: stats.signed, icon: CheckCircle },
    { label: 'Pending', value: stats.pending, icon: Clock },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm">
                      <span className="capitalize font-medium">{event.event_type}</span>
                      {event.document_name && (
                        <span className="text-muted-foreground"> - {event.document_name}</span>
                      )}
                    </p>
                    {event.actor_email && (
                      <p className="text-xs text-muted-foreground">{event.actor_email}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDateTime(event.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center py-4">
        <Link href="/dashboard/channels" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View all channels &rarr;
        </Link>
      </div>
    </div>
  )
}
