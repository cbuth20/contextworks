'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { DocumentDetail } from '@/components/admin/DocumentDetail'
import { useDocuments } from '@/hooks/useDocuments'
import { ArrowLeft } from 'lucide-react'
import type { Document } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function DocumentDetailPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { getDocumentById } = useDocuments()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocument() {
      const { data, error } = await getDocumentById(resolvedParams.id)
      if (error || !data) {
        router.push('/admin/documents')
        return
      }
      setDocument(data)
      setLoading(false)
    }

    fetchDocument()
  }, [resolvedParams.id])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!document) {
    return null
  }

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => router.push('/admin/documents')}
        className="mb-6 text-contextworks-silver-muted hover:text-contextworks-silver"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Documents
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-contextworks-black mb-2">Document Details</h1>
      </div>

      <DocumentDetail document={document as any} />
    </div>
  )
}
