import { logError } from '@/_gateway/_common/helpers'
import { DecodedToken } from '@/_gateway/firebase/_models/decoded-token'
import {
  serviceSignOut,
  serviceVerifySession,
} from '@/_gateway/firebase/service'
import { HEADERS } from '@/lib/constants/headers'
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

  const session = req.cookies.get(HEADERS.SESSION)?.value
  let verifiedToken: DecodedToken | null = null

  if (session) {
    try {
      const { decodedToken } = await serviceVerifySession(session)
      verifiedToken = decodedToken
    } catch (error) {
      logError(error)
      await serviceSignOut()
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
