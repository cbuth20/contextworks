import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="text-lg font-semibold tracking-tight">
              ContextWorks
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Strategic consulting and secure document management for modern businesses.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Navigation</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/login" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Admin Portal
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>connor@contextworks.co</p>
              <p>patrick@contextworks.co</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ContextWorks. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
