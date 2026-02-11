'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-contextworks-bg p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-red-600">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-contextworks-silver-muted">
            An unexpected error occurred. Please try again.
          </p>
          {error.message && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800 font-mono">{error.message}</p>
            </div>
          )}
          <div className="flex space-x-2">
            <Button onClick={() => reset()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
