import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  ROUTES,
} from '@/lib/constants/routes'
import { verifyUser } from '@/lib/api/users'
import { cookies } from 'next/headers'
import { ACCESS_TOKEN_KEY } from '@/lib/constants/keys'

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = PROTECTED_ROUTES.includes(path)
  const isPublicRoute = PUBLIC_ROUTES.includes(path)

  if (isPublicRoute) return NextResponse.next()

  if (isProtectedRoute) {
    try {
      const cookieStore = await cookies()
      if (!cookieStore.has(ACCESS_TOKEN_KEY))
        throw new Error()
      
      const { verified } = await verifyUser()

      if (!verified) throw new Error()
    } catch (error) {
      return NextResponse.redirect(
        new URL(ROUTES.HOME, req.nextUrl),
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
