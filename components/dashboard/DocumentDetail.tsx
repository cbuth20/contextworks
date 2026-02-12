'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { toast } from 'sonner'
import { formatDate, formatDateTime, formatFileSize } from '@/lib/utils'
import Link from 'next/link'
import { Share, Trash2 } from 'lucide-react'
import type { Document, DocumentEvent } from '@/types'

interface DocumentDetailProps {
  documentId: string
  channelId: string
}

export function DocumentDetail({ documentId, channelId }: DocumentDetailProps) {
  const [doc, setDoc] = useState<Document | null>(null)
  const [events, setEvents] = useState<DocumentEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showShare, setShowShare] = useState(false)
  const [shareEmail, setShareEmail] = useState('')
  const [sharing, setSharing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const supabase = createClient()

  const loadData = useCallback(async () => {
    const [docRes, eventsRes] = await Promise.all([
      supabase.from('documents').select('*, channel:channels(*, client:clients(*))').eq('id', documentId).single(),
      supabase.from('document_events').select('*').eq('document_id', documentId).order('created_at', { ascending: false }),
    ])

    setDoc(docRes.data as Document)
    setEvents((eventsRes.data as DocumentEvent[]) || [])
    setLoading(false)

    if (docRes.data?.file_path) {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(docRes.data.file_path, 3600)
      if (data?.signedUrl) setPreviewUrl(data.signedUrl)
    }
  }, [documentId, supabase])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleShare = async () => {
    if (!shareEmail) return
    setSharing(true)

    try {
      const res = await fetch('/api/documents/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, email: shareEmail }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Share failed')
      }

      toast.success('Document shared successfully')
      setShareEmail('')
      setShowShare(false)
      loadData()
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSharing(false)
    }
  }

  const handleDelete = async () => {
    if (!doc || !confirm('Are you sure you want to delete this document?')) return

    try {
      if (doc.file_path) {
        await supabase.storage.from('documents').remove([doc.file_path])
      }
      await supabase.from('documents').delete().eq('id', doc.id)
      toast.success('Document deleted')
      window.location.href = `/dashboard/channels/${channelId}`
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (!doc) return <p className="text-muted-foreground">Document not found</p>

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard/channels" className="hover:text-foreground transition-colors">Channels</Link>
        <span>/</span>
        <Link href={`/dashboard/channels/${channelId}`} className="hover:text-foreground transition-colors">
          {doc.channel?.name || 'Channel'}
        </Link>
        <span>/</span>
        <span className="text-foreground">{doc.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{doc.name}</h1>
            <StatusBadge status={doc.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {formatFileSize(doc.file_size)} &middot; Uploaded {formatDate(doc.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(doc.status === 'draft' || doc.status === 'sent') && (
            <Button size="sm" onClick={() => setShowShare(true)}>
              <Share className="h-4 w-4 mr-1.5" />
              {doc.status === 'draft' ? 'Share for Signing' : 'Reshare'}
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {previewUrl ? (
                <iframe src={previewUrl} className="w-full h-[600px] rounded-xl" title="Document Preview" />
              ) : (
                <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                  Preview unavailable
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {(doc.signer_name || doc.signer_email) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Signing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                {doc.signer_name && <p><span className="text-muted-foreground">Signer:</span> {doc.signer_name}</p>}
                {doc.signer_email && <p><span className="text-muted-foreground">Email:</span> {doc.signer_email}</p>}
                {doc.signed_at && <p><span className="text-muted-foreground">Signed:</span> {formatDateTime(doc.signed_at)}</p>}
              </CardContent>
            </Card>
          )}

          {doc.share_token && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Share Link</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground break-all font-mono">
                  {typeof window !== 'undefined' ? `${window.location.origin}/share/${doc.share_token}` : `/share/${doc.share_token}`}
                </div>
                {doc.share_token_expires_at && (
                  <p className="text-xs text-muted-foreground mt-2">Expires {formatDate(doc.share_token_expires_at)}</p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events yet</p>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                      <div>
                        <p className="text-sm capitalize">{event.event_type}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.actor_email && `${event.actor_email} - `}
                          {formatDateTime(event.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShare} onOpenChange={(v) => { if (!v) { setShareEmail(''); setShowShare(false) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Document for Signing</DialogTitle>
            <DialogDescription>A magic link will be sent to the recipient.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="share-email">Recipient Email</Label>
            <Input
              id="share-email"
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="client@example.com"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShareEmail(''); setShowShare(false) }}>Cancel</Button>
            <Button disabled={!shareEmail || sharing} onClick={handleShare}>
              {sharing ? 'Sending...' : 'Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
