import { logApiError } from '@/_gateway/api/_config/helpers'
import { DecodedToken } from "./_gateway/firebase/internal"
import {
  signOut,
  verifySession,
} from '@/_gateway/firebase/service'
import { REQUEST_HEADERS } from '@/lib/constants/request-headers'
import {
  isFallbackRoute,
  isProtectedRoute,
  isPublicRoute,
  ROUTES,
} from '@/lib/constants/routes'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (isFallbackRoute(path) || req.method !== 'GET') {
    return NextResponse.next()
  }

  const session = req.cookies.get(REQUEST_HEADERS.SESSION)?.value
  let verifiedToken: DecodedToken | null = null

  if (session) {
    try {
      const decodedToken = await verifySession(session)
      verifiedToken = decodedToken
    } catch (error) {
      logApiError(error)
      await signOut()
      return NextResponse.error()
    }
  }

  const isAuthenticated = !!verifiedToken
  
  if (isAuthenticated) {
    if (isProtectedRoute(path)) {
      return NextResponse.next()
    }

    if (isPublicRoute(path)) {
      return NextResponse.next()
    }
  }

  if (!isAuthenticated) {
    if (isProtectedRoute(path)) {
      return NextResponse.redirect(
        new URL(ROUTES.HOME, req.nextUrl),
      )
    }

    if (isPublicRoute(path)) {
      return NextResponse.next()
    }
  }

  console.log('Unknown path');
  return NextResponse.redirect(
    new URL(ROUTES.NOTFOUND, req.nextUrl),
  )
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
