import { SIGN_OUT, VERIFY_SESSION } from '@/lib/clients/auth'
import {
  APP_ROUTES,
  isFallbackRoute,
  isProtectedRoute,
  isPublicRoute,
} from '@/lib/constants/app-routes'
import { hasSession } from '@/lib/helpers/server/has-session'
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

  const session = await hasSession()
  let verified = false

  if (session) {
    try {
      verified = Boolean(await VERIFY_SESSION())
      console.log('Verified')
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
