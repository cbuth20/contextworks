import { LoginForm } from '@/components/shared/LoginForm'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-contextworks-bg">
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="/contextworks-logo.svg"
              alt="ContextWorks"
              width={180}
              height={60}
              priority
              className="h-auto"
            />
          </div>
          <div className="w-16 h-px bg-gradient-gold mx-auto mb-3"></div>
          <p className="text-sm text-contextworks-silver-muted font-light tracking-wide uppercase">
            Client Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl border border-contextworks-steel shadow-sm p-8">
          <h2 className="text-xl font-semibold text-contextworks-silver mb-2 text-center">
            Sign In
          </h2>
          <p className="text-sm text-contextworks-silver-muted mb-8 text-center">
            Enter your credentials to access your account
          </p>
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-contextworks-silver-muted text-center">
          Secure document signing and management
        </p>
      </div>
    </main>
  )
}
