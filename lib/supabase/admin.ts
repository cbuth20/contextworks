// Helper to check if the current user is an admin
export function isAdmin(email: string | undefined): boolean {
  if (!email) return false

  // Support comma-separated list of admin emails
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
  const adminList = adminEmails.split(',').map(e => e.trim())

  return adminList.includes(email)
}

// Helper to get all admin emails
export function getAdminEmails(): string[] {
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''
  return adminEmails.split(',').map(e => e.trim()).filter(e => e.length > 0)
}

// Helper to get primary admin email (first in list)
export function getAdminEmail(): string {
  const emails = getAdminEmails()
  return emails[0] || ''
}
