'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            ContextWorks
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Button asChild size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t space-y-3">
            <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <Link href="/login" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
