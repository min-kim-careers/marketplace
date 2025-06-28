'use server'

import { APP_DATA } from '@/lib/constants/app-data'
import { logError } from '@/lib/utils/log'
import { AxiosError } from 'axios'
import { cookies } from 'next/headers'
import { AuthErrorResponse } from './interfaces'

export const logAuthError = async (error: any) => {
  if (error instanceof AxiosError) {
    const authError = error.response
      ?.data as AuthErrorResponse
    if (authError) logError(authError)
  } else {
    logError(error)
  }
}

export const hasSessionCookie = async () => {
  const cookieStore = await cookies()
  return cookieStore.has(APP_DATA.SESSION_HEADER)
}

export const getSessionCookie =
  async (): Promise<string | null> => {
    const cookieStore = await cookies()
    const session = cookieStore.get(
      APP_DATA.SESSION_HEADER,
    )?.value
    return session || null
  }

export const setSessionCookie = async (
  session: string,
  expiresInSeconds: number,
) => {
  const cookieStore = await cookies()
  cookieStore.set(APP_DATA.SESSION_HEADER, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: expiresInSeconds,
  })
}

export const clearSessionCookie = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(APP_DATA.SESSION_HEADER)
}

export const createHash = async (
  base: string,
): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(base)
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    data,
  )
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return hashHex
}

export const createHandle = async (
  base: string,
): Promise<string> => {
  const hashed = await createHash(base)
  return 'user' + hashed.slice(0, 10)
}

