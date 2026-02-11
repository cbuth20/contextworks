'use client'

import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void
  onCancel?: () => void
}

export function SignaturePad({ onSave, onCancel }: SignaturePadProps) {
  const sigPadRef = useRef<SignatureCanvas>(null)
  const [isEmpty, setIsEmpty] = useState(true)

  const handleClear = () => {
    sigPadRef.current?.clear()
    setIsEmpty(true)
  }

  const handleSave = () => {
    if (sigPadRef.current && !isEmpty) {
      const dataUrl = sigPadRef.current.toDataURL('image/png')
      onSave(dataUrl)
    }
  }

  const handleBegin = () => {
    setIsEmpty(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Draw Your Signature</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white">
          <SignatureCanvas
            ref={sigPadRef}
            canvasProps={{
              className: 'w-full h-48 cursor-crosshair',
            }}
            onBegin={handleBegin}
          />
        </div>

        <p className="text-sm text-gray-500">
          Draw your signature using your mouse or finger on touch devices
        </p>

        <div className="flex space-x-2">
          <Button
            onClick={handleClear}
            variant="outline"
            className="flex-1"
          >
            Clear
          </Button>
          {onCancel && (
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={isEmpty}
            className="flex-1"
            variant="default"
          >
            Use This Signature
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
