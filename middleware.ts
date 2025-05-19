import { getUserId } from '@/lib/api/users'
import { GetUserIdResponse } from '@/lib/api/users/responses'
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
      // console.log('checking user');
      
      // const { userId }: getUserIdResponse =
      //   await getUserId()
      // if (!userId) throw new Error()

      // console.log('User verified:', userId)
      return NextResponse.next()
    } catch (error) {
      console.error('Error in middleware')
      return NextResponse.redirect(
        new URL(ROUTES.HOME, req.nextUrl),
      )
    }
  }

  console.error('Invalid path')
  return NextResponse.redirect(
    new URL(ROUTES.HOME, req.nextUrl),
  )
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
