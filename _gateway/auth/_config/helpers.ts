'use server'

import { AuthErrorResponse } from './interfaces'
import { APP_DATA } from '@/lib/constants/app-data'
import { envLoader } from '@/lib/utils/env-loader'
import { logError } from '@/lib/utils/log'
import { AxiosError } from 'axios'
import { cookies } from 'next/headers'
import { v5 as uuidv5 } from 'uuid'

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
  try {
    const cookieStore = await cookies()
    return cookieStore.has(APP_DATA.SESSION_HEADER)
  } catch (error) {
    throw error
  }
}

export const getSessionCookie = async (): Promise<
  string | null
> => {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(
      APP_DATA.SESSION_HEADER,
    )?.value
    return session ?? null
  } catch (error) {
    throw error
  }
}

export const setSessionCookie = async (
  session: string,
  expiresInSeconds: number,
) => {
  try {
    const cookieStore = await cookies()
    cookieStore.set(APP_DATA.SESSION_HEADER, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresInSeconds,
    })
  } catch (error) {
    throw error
  }
}

export const clearSessionCookie = async () => {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(APP_DATA.SESSION_HEADER)
  } catch (error) {
    throw error
  }
}

export const convertToUUID = async (uid: string) => {
  try {
    return uuidv5(uid, envLoader.UuidNamespace)
  } catch (error) {
    throw error
  }
}

export const createHash = async (base: string) => {
  try {
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
  } catch (error) {
    throw error
  }
}

export const createHandle = async (base: string) => {
  try {
    const hashed = await createHash(base)
    return 'user' + hashed
  } catch (error) {
    throw error
  }
}
