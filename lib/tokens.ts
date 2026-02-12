import crypto from 'crypto'

export function generateShareToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function getShareTokenExpiry(days: number = 30): Date {
  const expiry = new Date()
  expiry.setDate(expiry.getDate() + days)
  return expiry
}
