import { envLoader } from '@/lib/utils/env-loader'
import { authMiddleware } from 'next-firebase-auth-edge'
import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function middleware(req: NextRequest) {
  return authMiddleware(req, {
    loginPath: '/api/login',
    logoutPath: '/api/logout',
    apiKey: 'REDACTED',
    cookieName: 'session',
    cookieSignatureKeys: [
      '9irYZCncgbasIjAtERea+yEFmJHaPzksKxSv09XB/H8=',
    ],
    cookieSerializeOptions: {
      path: '/',
      httpOnly: true,
      secure: false, // Set this to true on HTTPS environments
      sameSite: 'lax' as const,
      maxAge: 12 * 60 * 60 * 24, // Twelve days
    },
    serviceAccount: {
      projectId: envLoader.firebaseAdminProjectId,
      clientEmail: envLoader.firebaseAdminClientEmail,
      privateKey: envLoader.firebaseAdminPrivateKey,
    },
  })
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
