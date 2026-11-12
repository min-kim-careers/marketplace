'use server'
import { env } from '@/lib/utils/env'
import { cookies } from 'next/headers'

export const setSession = async (value: string, expiry: number) => {
  const isProd = process.env.NODE_ENV === 'production'

  Boolean(
    (await cookies()).set(env.sessionHeader, value, {
      httpOnly: true,
      secure: isProd,
      path: '/',
      maxAge: expiry,
      sameSite: isProd ? 'strict' : 'lax',
    }),
  )
}
