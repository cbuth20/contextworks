import { Header } from '@/components/shared/Header'
import { Sidebar } from '@/components/shared/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-contextworks-bg">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
