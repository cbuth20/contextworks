import Image from 'next/image'

export default function SignLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-contextworks-bg">
      <header className="border-b border-contextworks-steel bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Image
            src="/contextworks-logo.svg"
            alt="ContextWorks"
            width={140}
            height={40}
            priority
            className="h-auto"
          />
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}
