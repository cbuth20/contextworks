'use client'

import { Button } from '@/components/ui/button'
import { NewDocumentForm } from '@/components/admin/NewDocumentForm'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NewDocumentPage() {
  const router = useRouter()

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
        <h1 className="text-3xl font-bold text-contextworks-black mb-2">New Document</h1>
        <p className="text-contextworks-silver-muted">Upload a PDF and assign it to a client</p>
      </div>

      <NewDocumentForm />
    </div>
  )
}
