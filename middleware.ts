import { verifySession } from '@/api'
import {
  APP_ROUTES,
  isAuthRoute,
  isFallbackRoute,
  isProtectedRoute,
  isPublicRoute,
} from '@/lib/constants/app-routes'
import { hasSession } from '@/lib/helpers/server/has-session'
import { toPath } from '@/lib/helpers/to-path'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const headers = new Headers(req.headers)
  const nextResponse = NextResponse.next({ request: { headers } })

  if (isFallbackRoute(path) || req.method !== 'GET') {
    return nextResponse
  }

  let verified = false
  if (await hasSession()) {
    try {
      verified = await verifySession()
    } catch (error) {
      console.error(error)
      return NextResponse.redirect(
        new URL(
          toPath(APP_ROUTES.REAUTH.href, { redirect: path }),
          req.nextUrl,
        ),
      )
    }
  }

  const isAuthenticated = !!verified

  if (isAuthenticated) {
    if (isAuthRoute(path)) {
      return NextResponse.redirect(new URL(APP_ROUTES.HOME.href, req.nextUrl))
    }

    if (isProtectedRoute(path)) {
      return nextResponse
    }

    if (isPublicRoute(path)) {
      return nextResponse
    }
  }

  if (!isAuthenticated) {
    if (isAuthRoute(path)) {
      return nextResponse
    }

    if (isProtectedRoute(path)) {
      return NextResponse.redirect(
        new URL(
          toPath(APP_ROUTES.REAUTH.href, { redirect: path }),
          req.nextUrl,
        ),
      )
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
