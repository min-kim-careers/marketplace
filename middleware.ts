import { logApiError } from '@/_gateway/api/_config/helpers'
import { DecodedToken } from './_gateway/firebase/interfaces'
import {
  SIGN_OUT,
  VERIFY_SESSION,
} from '@/_gateway/firebase/service'
import { APP_DATA } from "./lib/constants/app-data"
import {
  isFallbackRoute,
  isProtectedRoute,
  isPublicRoute,
  APP_ROUTES,
} from '@/lib/constants/app-routes'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (isFallbackRoute(path) || req.method !== 'GET') {
    return NextResponse.next()
  }

  const session = req.cookies.get(APP_DATA.SESSION_HEADER)?.value
  let verifiedToken: DecodedToken | null = null

  if (session) {
    try {
      const decodedToken = await VERIFY_SESSION(session)
      verifiedToken = decodedToken
    } catch (error) {
      logApiError(error)
      await SIGN_OUT()
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
        new URL(APP_ROUTES.HOME.url, req.nextUrl),
      )
    }

    if (isPublicRoute(path)) {
      return NextResponse.next()
    }
  }

  return NextResponse.redirect(
    new URL(APP_ROUTES.NOTFOUND.url, req.nextUrl),
  )
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
