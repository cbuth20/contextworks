import { LoginForm } from '@/components/auth/LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/brand/Logo'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center text-muted-foreground text-xs mt-4">
          Admin access only.
        </p>
      </div>
    </div>
  )
}
