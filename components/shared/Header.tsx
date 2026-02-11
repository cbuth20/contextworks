'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export function Header() {
  const { user, isAdmin, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <header className="border-b border-contextworks-steel bg-white">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src="/contextworks-logo.svg"
            alt="ContextWorks"
            width={140}
            height={40}
            priority
            className="h-auto"
          />
          {isAdmin && (
            <span className="px-2 py-0.5 text-xs bg-contextworks-gold/20 border border-contextworks-gold/30 rounded text-contextworks-gold font-medium">
              ADMIN
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm text-contextworks-silver-muted">{user.email}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-contextworks-steel text-contextworks-silver hover:bg-gray-100"
              >
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
