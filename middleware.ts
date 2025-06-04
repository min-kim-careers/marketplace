import { getSessionCookie, hasSessionCookie } from '@/_gateway/firebase/_config/helpers'
import { serviceVerify } from '@/_gateway/firebase/service'
import { HEADERS } from '@/lib/constants/headers'
import {
  isFallbackRoute,
  isProtectedRoute,
  ROUTES,
} from '@/lib/constants/routes'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  if (!isFallbackRoute(path)) {
    const session = req.cookies.get(HEADERS.SESSION)?.value
    if (session) {
      const { decodedToken } = await serviceVerify(session)
      if (!decodedToken) return NextResponse.error()

      if (
        !decodedToken.claims.profile_created &&
        path !== ROUTES.PROFILE_COMPLETE
      )
        return NextResponse.redirect(
          new URL(ROUTES.PROFILE_COMPLETE, req.nextUrl),
        )
    } else {
      if (isProtectedRoute(path)) return NextResponse.redirect(
          new URL(ROUTES.HOME, req.nextUrl),
        )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|robots.txt).*)',

    // '/',
    // '/market/:path',
    // '/item/:path',
    // '/profile/:path',
    // '/404'
  ],
}
