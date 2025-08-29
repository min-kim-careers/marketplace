'use server'
import { env } from '@/lib/utils/env'
import { cookies } from 'next/headers'

export const setSession = async (value: string, expiry: number) =>
  Boolean(
    (await cookies()).set(env.sessionHeader, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiry,
    }),
  )
