'use client'

import { useState } from 'react'
import { PDFViewer } from './PDFViewer'
import { SignaturePad } from './SignaturePad'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Pen } from 'lucide-react'

interface PDFSignerProps {
  documentId: string
  fileUrl: string
  onComplete: (signedPdfBlob: Blob) => void
}

export function PDFSigner({ documentId, fileUrl, onComplete }: PDFSignerProps) {
  const [step, setStep] = useState<'view' | 'sign' | 'place'>('view')
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSigning, setIsSigning] = useState(false)

  const handleStartSigning = () => {
    setStep('sign')
  }

  const handleSignatureSaved = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl)
    setStep('place')
  }

  const handlePlaceSignature = async (x: number, y: number) => {
    if (!signatureDataUrl) return

    setIsSigning(true)

    try {
      // Fetch the original PDF
      const pdfResponse = await fetch(fileUrl)
      const pdfBlob = await pdfResponse.blob()

      // Send to API for signing
      const formData = new FormData()
      formData.append('pdf', pdfBlob)
      formData.append('signature', signatureDataUrl)
      formData.append('x', x.toString())
      formData.append('y', y.toString())
      formData.append('page', currentPage.toString())
      formData.append('documentId', documentId)

      const response = await fetch('/api/sign-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to sign PDF')
      }

      const signedPdfBlob = await response.blob()
      onComplete(signedPdfBlob)
    } catch (error) {
      console.error('Error signing PDF:', error)
      alert('Failed to sign document. Please try again.')
    } finally {
      setIsSigning(false)
    }
  }

  const handleRedrawSignature = () => {
    setSignatureDataUrl(null)
    setStep('sign')
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {step === 'view' && <Pen className="mr-2 h-5 w-5" />}
            {step === 'sign' && <Pen className="mr-2 h-5 w-5" />}
            {step === 'place' && <CheckCircle className="mr-2 h-5 w-5" />}

            {step === 'view' && 'Review Document'}
            {step === 'sign' && 'Create Your Signature'}
            {step === 'place' && 'Place Your Signature'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'view' && (
            <div>
              <p className="text-gray-600 mb-4">
                Please review the document below. When you&apos;re ready to sign, click the button.
              </p>
              <Button onClick={handleStartSigning} variant="gold">
                <Pen className="mr-2 h-4 w-4" />
                Start Signing Process
              </Button>
            </div>
          )}

          {step === 'sign' && (
            <p className="text-gray-600">
              Draw your signature in the box below using your mouse or finger.
            </p>
          )}

          {step === 'place' && (
            <div>
              <p className="text-gray-600 mb-4">
                Click anywhere on the document to place your signature.
              </p>
              {signatureDataUrl && (
                <div className="flex items-center space-x-4">
                  <div className="border rounded p-2 bg-white">
                    <img
                      src={signatureDataUrl}
                      alt="Your signature"
                      className="h-12"
                    />
                  </div>
                  <Button
                    onClick={handleRedrawSignature}
                    variant="outline"
                    size="sm"
                  >
                    Redraw Signature
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signature Pad */}
      {step === 'sign' && (
        <SignaturePad
          onSave={handleSignatureSaved}
          onCancel={() => setStep('view')}
        />
      )}

      {/* PDF Viewer */}
      {(step === 'view' || step === 'place') && (
        <Card>
          <CardContent className="pt-6">
            <div
              className={step === 'place' ? 'cursor-crosshair' : ''}
              onClick={(e) => {
                if (step === 'place' && !isSigning) {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  handlePlaceSignature(x, y)
                }
              }}
            >
              <PDFViewer
                fileUrl={fileUrl}
                selectedPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>

            {isSigning && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-contextworks-gold mr-3"></div>
                <span className="text-gray-600">Signing document...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
