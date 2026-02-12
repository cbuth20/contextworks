'use client'

import { useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@/components/ui/button'

interface SignatureDrawerProps {
  onSave: (dataUrl: string) => void
  onCancel: () => void
}

export function SignatureDrawer({ onSave, onCancel }: SignatureDrawerProps) {
  const sigRef = useRef<SignatureCanvas>(null)

  const handleSave = () => {
    if (sigRef.current?.isEmpty()) return
    const dataUrl = sigRef.current?.toDataURL('image/png')
    if (dataUrl) onSave(dataUrl)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">Draw your signature below:</p>
      <div className="bg-white rounded-md overflow-hidden border">
        <SignatureCanvas
          ref={sigRef}
          canvasProps={{
            className: 'w-full',
            width: 500,
            height: 200,
            style: { width: '100%', height: '200px' },
          }}
          penColor="black"
          backgroundColor="white"
        />
      </div>
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => sigRef.current?.clear()}>
          Clear
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button size="sm" onClick={handleSave}>Apply Signature</Button>
        </div>
      </div>
    </div>
  )
}
