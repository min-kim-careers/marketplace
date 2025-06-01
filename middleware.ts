import type { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function middleware(req: NextRequest) {
  
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
