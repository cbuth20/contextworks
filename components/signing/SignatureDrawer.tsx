'use client'

import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@/components/ui/button'

interface SignatureDrawerProps {
  onSave: (signatureDataUrl: string) => void
  onCancel?: () => void
}

export function SignatureDrawer({ onSave, onCancel }: SignatureDrawerProps) {
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
    <div className="space-y-4">
      <div className="border-2 border-dashed border-contextworks-steel rounded-lg bg-white overflow-hidden">
        <SignatureCanvas
          ref={sigPadRef}
          canvasProps={{
            className: 'w-full cursor-crosshair',
            style: { height: '200px', width: '100%' },
          }}
          penColor="#111827"
          onBegin={handleBegin}
        />
      </div>

      <p className="text-sm text-contextworks-silver-muted">
        Draw your signature using your mouse or finger on touch devices
      </p>

      <div className="flex space-x-3">
        <Button onClick={handleClear} variant="outline">
          Clear
        </Button>
        {onCancel && (
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={isEmpty}
          variant="gold"
        >
          Use This Signature
        </Button>
      </div>
    </div>
  )
}
