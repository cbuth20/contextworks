'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Download } from 'lucide-react'

interface SignedConfirmationProps {
  title: string
  signedPdfUrl?: string | null
}

export function SignedConfirmation({ title, signedPdfUrl }: SignedConfirmationProps) {
  return (
    <Card className="max-w-lg mx-auto mt-12">
      <CardContent className="pt-8 pb-8 text-center space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />

        <h2 className="text-2xl font-bold text-contextworks-black">
          Document Successfully Signed
        </h2>

        <p className="text-contextworks-silver-muted">
          &ldquo;{title}&rdquo; has been signed. The sender has been notified.
        </p>

        {signedPdfUrl && (
          <Button
            variant="outline"
            onClick={() => window.open(signedPdfUrl, '_blank')}
            className="mt-4"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Signed PDF
          </Button>
        )}

        <p className="text-xs text-contextworks-silver-muted pt-4">
          You can safely close this page.
        </p>
      </CardContent>
    </Card>
  )
}
