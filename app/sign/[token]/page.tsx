'use client'

import { use, useEffect, useState } from 'react'
import { SigningPage } from '@/components/signing/SigningPage'
import { SignedConfirmation } from '@/components/signing/SignedConfirmation'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ token: string }>
}

interface DocumentData {
  id: string
  title: string
  status: string
  clientName: string
  pdfUrl: string | null
  signedPdfUrl: string | null
}

export default function SignTokenPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const [document, setDocument] = useState<DocumentData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [justSigned, setJustSigned] = useState(false)

  useEffect(() => {
    async function fetchDocument() {
      try {
        const response = await fetch(`/api/document-by-token?token=${resolvedParams.token}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || 'Failed to load document')
          return
        }

        setDocument(data)
      } catch (err: any) {
        setError('Failed to load document. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [resolvedParams.token])

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner />
        <p className="text-center text-contextworks-silver-muted mt-4">Loading document...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="max-w-lg mx-auto mt-12">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Unable to Load Document</h2>
          <p className="text-contextworks-silver-muted">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!document) {
    return null
  }

  // Already signed (from previous visit or just completed)
  if (document.status === 'signed' || justSigned) {
    return (
      <SignedConfirmation
        title={document.title}
        signedPdfUrl={document.signedPdfUrl}
      />
    )
  }

  // Signable
  if (document.pdfUrl) {
    return (
      <SigningPage
        documentId={document.id}
        title={document.title}
        pdfUrl={document.pdfUrl}
        token={resolvedParams.token}
        onComplete={() => setJustSigned(true)}
      />
    )
  }

  return (
    <Card className="max-w-lg mx-auto mt-12">
      <CardContent className="pt-6 text-center">
        <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <h2 className="text-lg font-semibold mb-2">Document Not Available</h2>
        <p className="text-contextworks-silver-muted">
          The PDF for this document is not available. Please contact the sender.
        </p>
      </CardContent>
    </Card>
  )
}
