'use client'

import { useState } from 'react'
import { PDFViewer } from '@/components/client/PDFViewer'
import { SignatureDrawer } from './SignatureDrawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Pen, MousePointer } from 'lucide-react'

type SigningStep = 'idle' | 'drawing' | 'placing' | 'confirming' | 'signed'

interface SigningPageProps {
  documentId: string
  title: string
  pdfUrl: string
  token: string
  onComplete: () => void
}

export function SigningPage({ documentId, title, pdfUrl, token, onComplete }: SigningPageProps) {
  const [step, setStep] = useState<SigningStep>('idle')
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [signaturePosition, setSignaturePosition] = useState<{ x: number; y: number } | null>(null)
  const [isSigning, setIsSigning] = useState(false)

  const handleSignatureReady = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl)
    setStep('placing')
  }

  const handlePlaceSignature = (x: number, y: number) => {
    setSignaturePosition({ x, y })
    setStep('confirming')
  }

  const handleConfirmSign = async () => {
    if (!signatureDataUrl || !signaturePosition) return

    setIsSigning(true)

    try {
      // Fetch the original PDF
      const pdfResponse = await fetch(pdfUrl)
      const pdfBlob = await pdfResponse.blob()

      // Send to API for signing
      const formData = new FormData()
      formData.append('pdf', pdfBlob)
      formData.append('signature', signatureDataUrl)
      formData.append('x', signaturePosition.x.toString())
      formData.append('y', signaturePosition.y.toString())
      formData.append('page', currentPage.toString())
      formData.append('token', token)
      formData.append('documentId', documentId)

      const response = await fetch('/api/sign-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to sign PDF')
      }

      setStep('signed')
      onComplete()
    } catch (error: any) {
      console.error('Error signing PDF:', error)
      alert(`Failed to sign document: ${error.message}. Please try again.`)
      setStep('placing')
    } finally {
      setIsSigning(false)
    }
  }

  const handleRedraw = () => {
    setSignatureDataUrl(null)
    setSignaturePosition(null)
    setStep('drawing')
  }

  return (
    <div className="space-y-6">
      {/* Document Header */}
      <div>
        <h1 className="text-2xl font-bold text-contextworks-black">{title}</h1>
        <p className="text-contextworks-silver-muted mt-1">Please review and sign this document</p>
      </div>

      {/* Step Indicator */}
      <Card>
        <CardContent className="pt-6">
          {step === 'idle' && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium flex items-center">
                  <Pen className="mr-2 h-5 w-5 text-contextworks-gold" />
                  Step 1: Review the document, then draw your signature
                </h3>
                <p className="text-sm text-contextworks-silver-muted mt-1">
                  Review the document below, then click the button to start signing.
                </p>
              </div>
              <Button variant="gold" onClick={() => setStep('drawing')}>
                <Pen className="mr-2 h-4 w-4" />
                Draw Signature
              </Button>
            </div>
          )}

          {step === 'drawing' && (
            <div>
              <h3 className="font-medium flex items-center mb-4">
                <Pen className="mr-2 h-5 w-5 text-contextworks-gold" />
                Step 1: Draw your signature
              </h3>
              <SignatureDrawer
                onSave={handleSignatureReady}
                onCancel={() => setStep('idle')}
              />
            </div>
          )}

          {step === 'placing' && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium flex items-center">
                  <MousePointer className="mr-2 h-5 w-5 text-contextworks-gold" />
                  Step 2: Click on the document to place your signature
                </h3>
                {signatureDataUrl && (
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="border border-contextworks-steel rounded p-2 bg-white inline-block">
                      <img src={signatureDataUrl} alt="Your signature" className="h-10" />
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleRedraw}>
                      Redraw
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'confirming' && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Step 3: Confirm and sign
                </h3>
                <p className="text-sm text-contextworks-silver-muted mt-1">
                  Your signature has been placed. Click confirm to complete signing.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => { setSignaturePosition(null); setStep('placing') }}>
                  Reposition
                </Button>
                <Button variant="gold" onClick={handleConfirmSign} disabled={isSigning}>
                  {isSigning ? 'Signing...' : 'Confirm & Sign'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDF Viewer */}
      {step !== 'drawing' && (
        <Card>
          <CardContent className="pt-6">
            <div
              className={step === 'placing' ? 'cursor-crosshair' : ''}
              onClick={(e) => {
                if (step === 'placing') {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  handlePlaceSignature(x, y)
                }
              }}
            >
              <PDFViewer
                fileUrl={pdfUrl}
                selectedPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>

            {isSigning && (
              <div className="mt-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-contextworks-gold mr-3"></div>
                <span className="text-contextworks-silver-muted">Signing document...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
