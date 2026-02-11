import { randomBytes } from 'crypto'

/**
 * Generates a cryptographically secure share token
 */
export function generateShareToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Builds the full share URL for a given token
 */
export function getShareUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/sign/${token}`
}

/**
 * Checks if a token has expired
 */
export function isTokenExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

/**
 * Returns an expiration date 30 days from now
 */
export function getTokenExpiry(): string {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + 30)
  return expiry.toISOString()
}
