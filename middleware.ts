import { serverVerify } from '@/_gateway/auth/internal/transport'
import {
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  ROUTES,
} from '@/lib/constants/routes'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = PROTECTED_ROUTES.includes(path)
  const isPublicRoute = PUBLIC_ROUTES.includes(path)

  if (isPublicRoute) return NextResponse.next()

  if (isProtectedRoute) {
    try {
      await serverVerify()
      return NextResponse.next()
    } catch (error) {
      console.error(error)

      return NextResponse.redirect(
        new URL(ROUTES.HOME, req.nextUrl),
      )
    }
  }

  // console.error(`Unknown path: ${path}`)
  return NextResponse.rewrite(
    new URL(ROUTES.NOTFOUND, req.nextUrl),
  )
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
