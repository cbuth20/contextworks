'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { useDocuments } from '@/hooks/useDocuments'
import { useRouter } from 'next/navigation'
import { Send, Download, Trash2, Copy, Link, FileText, User, Clock } from 'lucide-react'
import { format } from 'date-fns'
import type { Document } from '@/types'

interface DocumentDetailProps {
  document: Document & { clients?: any }
}

export function DocumentDetail({ document: doc }: DocumentDetailProps) {
  const router = useRouter()
  const { shareDocument, getSignedUrl, deleteDocument } = useDocuments()
  const [isSharing, setIsSharing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSend = async () => {
    setIsSharing(true)
    setMessage(null)

    try {
      const { data, error } = await shareDocument(doc.id)
      if (error) throw new Error(error)
      setMessage({ type: 'success', text: 'Document sent to client successfully!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setIsSharing(false)
    }
  }

  const handleResend = async () => {
    setIsSharing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/share-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: doc.id, resend: true }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setMessage({ type: 'success', text: 'Email resent successfully!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyLink = () => {
    if (doc.share_token) {
      const baseUrl = window.location.origin
      const url = `${baseUrl}/sign/${doc.share_token}`
      navigator.clipboard.writeText(url)
      setMessage({ type: 'success', text: 'Link copied to clipboard!' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDownload = async () => {
    if (!doc.signed_file_path) return
    const { data } = await getSignedUrl(doc.signed_file_path, 'signed-documents')
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) return

    setIsDeleting(true)
    try {
      const { error } = await deleteDocument(doc.id)
      if (error) throw new Error(error)
      router.push('/admin/documents')
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
      setIsDeleting(false)
    }
  }

  const clientName = doc.client_name || doc.clients?.full_name || 'Unknown'
  const clientEmail = doc.client_email || doc.clients?.email || ''

  return (
    <div className="max-w-3xl space-y-6">
      {/* Document Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{doc.title}</CardTitle>
            <StatusBadge status={doc.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <User className="h-5 w-5 text-contextworks-silver-muted mt-0.5" />
              <div>
                <p className="text-sm font-medium">{clientName}</p>
                <p className="text-sm text-contextworks-silver-muted">{clientEmail}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-contextworks-silver-muted mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  {doc.original_file_path?.split('/').pop() || 'No file'}
                </p>
                <p className="text-sm text-contextworks-silver-muted">PDF Document</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-contextworks-steel pt-4 space-y-2">
            <div className="flex items-center space-x-3 text-sm">
              <Clock className="h-4 w-4 text-contextworks-silver-muted" />
              <span className="text-contextworks-silver-muted">Created:</span>
              <span>{format(new Date(doc.created_at), 'MMM d, yyyy h:mm a')}</span>
            </div>
            {doc.sent_at && (
              <div className="flex items-center space-x-3 text-sm">
                <Send className="h-4 w-4 text-blue-500" />
                <span className="text-contextworks-silver-muted">Sent:</span>
                <span>{format(new Date(doc.sent_at), 'MMM d, yyyy h:mm a')}</span>
              </div>
            )}
            {doc.viewed_at && (
              <div className="flex items-center space-x-3 text-sm">
                <FileText className="h-4 w-4 text-purple-500" />
                <span className="text-contextworks-silver-muted">Viewed:</span>
                <span>{format(new Date(doc.viewed_at), 'MMM d, yyyy h:mm a')}</span>
              </div>
            )}
            {doc.signed_at && (
              <div className="flex items-center space-x-3 text-sm">
                <FileText className="h-4 w-4 text-green-500" />
                <span className="text-contextworks-silver-muted">Signed:</span>
                <span>{format(new Date(doc.signed_at), 'MMM d, yyyy h:mm a')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {doc.status === 'draft' && (
            <div className="flex space-x-3">
              <Button
                variant="gold"
                onClick={handleSend}
                disabled={isSharing}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSharing ? 'Sending...' : 'Send to Client'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}

          {(doc.status === 'sent' || doc.status === 'viewed') && (
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={isSharing}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSharing ? 'Sending...' : 'Resend Email'}
              </Button>
              {doc.share_token && (
                <Button variant="outline" onClick={handleCopyLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
              )}
            </div>
          )}

          {doc.status === 'signed' && (
            <div className="flex space-x-3">
              <Button variant="gold" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Signed PDF
              </Button>
            </div>
          )}

          {doc.share_token && (
            <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-2">
              <Link className="h-4 w-4 text-contextworks-silver-muted flex-shrink-0" />
              <code className="text-xs text-contextworks-silver-muted break-all">
                {`${typeof window !== 'undefined' ? window.location.origin : ''}/sign/${doc.share_token}`}
              </code>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      {message && (
        <div
          className={`rounded-lg p-4 border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      )}
    </div>
  )
}
