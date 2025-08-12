import { verifySession } from '@/api'
import {
  APP_ROUTES,
  isAuthRoute,
  isFallbackRoute,
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

  if (isFallbackRoute(path) || req.method !== 'GET' || isAuthRoute(path)) {
    return nextResponse
  }

  if (await hasSession()) {
    if (!(await verifySession())) {
      return NextResponse.redirect(
        new URL(
          toPath(APP_ROUTES.REAUTH.href, { redirect: path }),
          req.nextUrl,
        ),
      )
    }

    return nextResponse
  }

  if (isPublicRoute(path)) {
    return nextResponse
  }

  return NextResponse.redirect(new URL(APP_ROUTES.NOTFOUND.href, req.nextUrl))
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
