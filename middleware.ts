import { logApiError } from '@/_gateway/api/_config/helpers'
import { FirebaseUser } from './lib/clients/auth/firebase/interfaces'
import { SIGN_OUT, VERIFY_SESSION } from '@/lib/clients/firebase'
import { APP_DATA } from './lib/constants/app-data'
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
  const headers = new Headers(req.headers)
  headers.set('x-current-path', req.nextUrl.pathname)
  const nextResponse = NextResponse.next({ request: { headers } })

  if (isFallbackRoute(path) || req.method !== 'GET') {
    return nextResponse
  }

  const session = req.cookies.get(APP_DATA.SESSION_HEADER)?.value
  let verified = false

  if (session) {
    try {
      verified = Boolean(await VERIFY_SESSION(session))
      console.log('Verified');
    } catch (_) {
      await SIGN_OUT()
      return NextResponse.error()
    }
  }

  const isAuthenticated = !!verified

  if (isAuthenticated) {
    if (isProtectedRoute(path)) {
      return nextResponse
    }

    if (isPublicRoute(path)) {
      return nextResponse
    }
  }

  if (!isAuthenticated) {
    if (isProtectedRoute(path)) {
      return NextResponse.redirect(new URL(APP_ROUTES.HOME.href, req.nextUrl))
    }

    if (isPublicRoute(path)) {
      return nextResponse
    }
  }

  return NextResponse.redirect(new URL(APP_ROUTES.NOTFOUND.href, req.nextUrl))
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
