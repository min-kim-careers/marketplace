import { HEADERS } from '@/lib/constants/headers'
import {
  isProtectedRoute,
  isPublicRoute,
  ROUTES,
} from '@/lib/constants/routes'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const session = req.cookies.get(HEADERS.SESSION)

  const headers = new Headers(req.headers)
  headers.set(HEADERS.CURRENT_PATH, req.nextUrl.pathname)

  if (
    isPublicRoute(path) ||
    (session && isProtectedRoute(path))
  )
    return NextResponse.next({ headers })

  return NextResponse.redirect(
    new URL(ROUTES.NOTFOUND, req.nextUrl),
  )
}

export const config = {
  matcher: [
    // '/',
    // '/market/:path',
    // '/item/:path',
    // '/profile/:path',
    // '/404'
  ],
}
