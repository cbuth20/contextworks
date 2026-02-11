'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DocumentTable } from '@/components/admin/DocumentTable'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useDocuments } from '@/hooks/useDocuments'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Document } from '@/types'

export default function DocumentsPage() {
  const { documents, loading, getSignedUrl } = useDocuments()

  const handleSendForSignature = async (document: Document) => {
    if (!confirm('Send this document for signature?')) return

    try {
      const response = await fetch('/api/share-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: document.id }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Document sent for signature successfully!')
        window.location.reload()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    }
  }

  const handleDownload = async (document: Document) => {
    if (!document.signed_file_path) return

    const { data } = await getSignedUrl(document.signed_file_path, 'signed-documents')
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-contextworks-black mb-2">Documents</h1>
          <p className="text-contextworks-silver-muted">Manage and track all client documents</p>
        </div>
        <Link href="/admin/documents/new">
          <Button variant="gold" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            New Document
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentTable
            documents={documents}
            onSendForSignature={handleSendForSignature}
            onDownload={handleDownload}
          />
        </CardContent>
      </Card>
    </div>
  )
}
