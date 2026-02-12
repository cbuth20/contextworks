'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SignatureDrawer } from '@/components/signing/SignatureDrawer'
import { SignedConfirmation } from '@/components/signing/SignedConfirmation'
import { Loader2, AlertTriangle, Pen } from 'lucide-react'

interface DocumentData {
  id: string
  name: string
  fileUrl: string
  status: string
  signerName?: string
  signerEmail?: string
  signedAt?: string
}

export function SigningPage({ token }: { token: string }) {
  const [doc, setDoc] = useState<DocumentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [signerName, setSignerName] = useState('')
  const [signerEmail, setSignerEmail] = useState('')
  const [showSignature, setShowSignature] = useState(false)
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [signed, setSigned] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/documents/by-token?token=${token}`)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to load document')
        }
        const data = await res.json()
        setDoc(data)
        if (data.signerEmail) setSignerEmail(data.signerEmail)
        if (data.signerName) setSignerName(data.signerName)
        if (data.status === 'signed') setSigned(true)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const handleSign = async () => {
    if (!signatureDataUrl || !signerName || !signerEmail) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/documents/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, signerName, signerEmail, signatureDataUrl }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Signing failed')
      }

      setSigned(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading document...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl font-bold tracking-tight mb-2">Unable to Load Document</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (signed) return <SignedConfirmation signerName={signerName} />

  if (!doc) return null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">{doc.name}</p>
            <p className="text-xs text-muted-foreground">Review and sign this document</p>
          </div>
          <span className="text-sm font-medium tracking-tight">ContextWorks</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PDF Preview */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                {doc.fileUrl ? (
                  <iframe src={doc.fileUrl} className="w-full h-[600px] lg:h-[700px] rounded-xl" title="Document Preview" />
                ) : (
                  <div className="h-[600px] flex items-center justify-center text-muted-foreground">
                    Preview unavailable
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Signing Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sign Document</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signer-name">Full Name</Label>
                  <Input
                    id="signer-name"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signer-email">Email</Label>
                  <Input
                    id="signer-email"
                    type="email"
                    value={signerEmail}
                    onChange={(e) => setSignerEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {signatureDataUrl ? (
                  <div className="space-y-1">
                    <Label>Signature</Label>
                    <div className="bg-white rounded-md p-2 border">
                      <img src={signatureDataUrl} alt="Your signature" className="max-h-20 mx-auto" />
                    </div>
                    <button
                      onClick={() => { setSignatureDataUrl(null); setShowSignature(true) }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Redo signature
                    </button>
                  </div>
                ) : showSignature ? (
                  <SignatureDrawer
                    onSave={(dataUrl) => { setSignatureDataUrl(dataUrl); setShowSignature(false) }}
                    onCancel={() => setShowSignature(false)}
                  />
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => setShowSignature(true)}>
                    <Pen className="h-4 w-4 mr-2" />
                    Add Signature
                  </Button>
                )}

                <Button
                  className="w-full"
                  disabled={!signerName || !signerEmail || !signatureDataUrl || submitting}
                  onClick={handleSign}
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Signing...</>
                  ) : (
                    'Submit Signature'
                  )}
                </Button>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              By signing, you agree that your electronic signature is the legal equivalent of your handwritten signature.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
