import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-contextworks-bg">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-contextworks-black mb-4">404</h1>
        <div className="w-24 h-1 bg-contextworks-gold mx-auto mb-6"></div>
        <p className="text-xl text-contextworks-silver-muted mb-8">
          Page not found
        </p>
        <p className="text-contextworks-silver-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="default">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
