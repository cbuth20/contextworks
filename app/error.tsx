'use client'

import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  )
}
