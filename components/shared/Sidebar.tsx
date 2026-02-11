'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { FileText, Users, LayoutDashboard } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/documents', label: 'Documents', icon: FileText },
    { href: '/admin/clients', label: 'Clients', icon: Users },
  ]

  return (
    <aside className="w-64 bg-white border-r border-contextworks-steel min-h-[calc(100vh-64px)]">
      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-contextworks-gold text-white shadow-lg shadow-contextworks-gold/20'
                  : 'text-contextworks-silver-muted hover:bg-gray-100 hover:text-contextworks-silver'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
