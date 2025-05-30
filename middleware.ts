import {
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  ROUTES,
} from '@/lib/constants/routes'
import {
  firebaseGetProfileBySession,
  firebaseGetProfileByUid,
  firebaseGetVerifiedSession,
} from '@/lib/firebase/service'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  return NextResponse.next()

  // const path = req.nextUrl.pathname
  // const isProtectedRoute = PROTECTED_ROUTES.includes(path)
  // const isPublicRoute = PUBLIC_ROUTES.includes(path)

  // const session = await firebaseGetVerifiedSession()
  // const isAuthenticated = !!session
  // if (isAuthenticated) {
  //   if (!session.)
  //     return NextResponse.redirect(
  //       new URL(ROUTES.PROFILE_COMPLETE, req.nextUrl),
  //     )
  // }

  // if (isPublicRoute) return NextResponse.next()

  // if (isProtectedRoute) {
  //   const { profile } = await firebaseGetProfileBySession()

  //   return NextResponse.next()
  // }

  // return NextResponse.redirect(
  //   new URL(ROUTES.HOME, req.nextUrl),
  // )
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
