import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // /sign/* is public (token-based access, no auth needed)
  if (request.nextUrl.pathname.startsWith('/sign')) {
    return response
  }

  // Protected admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Check if user is admin
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    const adminList = (adminEmail || '').split(',').map(e => e.trim())
    if (!adminList.includes(user.email || '')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Redirect authenticated admin from home to dashboard
  if (request.nextUrl.pathname === '/' && user) {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    const adminList = (adminEmail || '').split(',').map(e => e.trim())
    if (adminList.includes(user.email || '')) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
