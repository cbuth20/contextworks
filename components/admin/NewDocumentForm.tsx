'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload } from '@/components/shared/FileUpload'
import { useClients } from '@/hooks/useClients'
import { useDocuments } from '@/hooks/useDocuments'
import { useRouter } from 'next/navigation'
import { Send, Save } from 'lucide-react'

export function NewDocumentForm() {
  const router = useRouter()
  const { findOrCreateClient } = useClients()
  const { createDocument, uploadFile, shareDocument } = useDocuments()

  const [title, setTitle] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (sendImmediately: boolean) => {
    if (!title.trim() || !clientName.trim() || !clientEmail.trim() || !selectedFile) {
      setError('Please fill in all fields and select a PDF file.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Find or create client
      const { data: client, error: clientError } = await findOrCreateClient(clientEmail, clientName)
      if (clientError || !client) {
        throw new Error(clientError || 'Failed to create client record')
      }

      // Create document record
      const { data: doc, error: docError } = await createDocument({
        title,
        client_id: client.id,
        client_email: clientEmail,
        client_name: clientName,
      })

      if (docError || !doc) {
        throw new Error(docError || 'Failed to create document')
      }

      const document = doc as any

      // Upload PDF to storage
      const { error: uploadError } = await uploadFile(selectedFile, client.id, document.id)
      if (uploadError) {
        throw new Error(uploadError)
      }

      // Update document with file path
      const filePath = `${client.id}/${document.id}/${selectedFile.name}`
      const response = await fetch('/api/update-document-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: document.id, filePath }),
      })

      if (!response.ok) {
        // Fallback: try to update directly
        await fetch(`/api/update-document-path`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId: document.id, filePath }),
        })
      }

      // If "Upload & Send", trigger sharing
      if (sendImmediately) {
        const { error: shareError } = await shareDocument(document.id)
        if (shareError) {
          // Document was created but sharing failed
          alert(`Document created but sharing failed: ${shareError}. You can send it from the document detail page.`)
          router.push(`/admin/documents/${document.id}`)
          return
        }
      }

      router.push('/admin/documents')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Document Section */}
      <Card>
        <CardHeader>
          <CardTitle>Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Service Agreement 2024"
              className="mt-2"
            />
          </div>
          <div>
            <Label>PDF File</Label>
            <div className="mt-2">
              <FileUpload
                accept=".pdf"
                maxSize={52428800}
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipient Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recipient</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="John Smith"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="clientEmail">Client Email</Label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="john@example.com"
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/documents')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button
          variant="gold"
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting}
        >
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Sending...' : 'Upload & Send'}
        </Button>
      </div>
    </div>
  )
}
