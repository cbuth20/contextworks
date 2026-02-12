const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase())

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export async function requireAdmin(supabase: ReturnType<typeof import('./server').createServerSupabaseClient>) {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user || !isAdminEmail(user.email || '')) {
    return null
  }

  return user
}
