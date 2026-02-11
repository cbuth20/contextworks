'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else if (data.user) {
        router.push('/admin')
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <Label htmlFor="email" className="text-contextworks-silver text-sm font-medium">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            autoComplete="email"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-contextworks-silver text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            autoComplete="current-password"
            className="mt-2"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-gold hover:opacity-90 text-white font-semibold transition-opacity"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {message && (
        <div
          className={`mt-4 rounded-lg p-4 border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      )}
    </div>
  )
}
