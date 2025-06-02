import { logError } from '@/_gateway/_common/helpers'
import { serviceVerify } from '@/_gateway/firebase/service'
import {
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  ROUTES,
} from '@/lib/constants/routes'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = PROTECTED_ROUTES.includes(path)
  const isPublicRoute = PUBLIC_ROUTES.includes(path)

  const session = req.cookies.get('__session')

  let verified = false

  if (session) {
    const res = await serviceVerify(session.value)
    if (!res.profileCreated)
      return NextResponse.redirect(
        new URL(ROUTES.PROFILE_COMPLETE, req.nextUrl),
      )
    verified = true
  }

  if (isPublicRoute) return NextResponse.next()

  if (isProtectedRoute && verified) {
    return NextResponse.next()
  }

  return NextResponse.redirect(
    new URL(ROUTES.HOME, req.nextUrl),
  )
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
