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
  headers.set('x-pathname', path)

  const nextResponse = NextResponse.next({ request: { headers } })

  if (
    isPublicRoute(path) ||
    isFallbackRoute(path) ||
    isAuthRoute(path) ||
    req.method !== 'GET'
  ) {
    return nextResponse
  }

  let session = false
  try {
    session = await hasSession()
  } catch (e) {
    console.error('hasSession() threw:', e)
    session = false
  }

  if (session) {
    try {
      const ok = await verifySession()
      if (!ok) throw new Error('invalid or missing session')
      return nextResponse
    } catch (e) {
      console.error('verifySession() threw:', e)
      return NextResponse.redirect(
        new URL(
          toPath(APP_ROUTES.REAUTH.href, { redirect: path }),
          req.nextUrl,
        ),
      )
    }
  }

  return NextResponse.redirect(new URL(APP_ROUTES.NOTFOUND.href, req.nextUrl))
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
