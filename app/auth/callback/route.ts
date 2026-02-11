import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get user to determine redirect
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Redirect admin to admin dashboard, clients to documents
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      if (user?.email === adminEmail) {
        return NextResponse.redirect(`${origin}/admin`)
      } else {
        return NextResponse.redirect(`${origin}/documents`)
      }
    }
  }

  // Return to home page if something went wrong
  return NextResponse.redirect(`${origin}/`)
}
