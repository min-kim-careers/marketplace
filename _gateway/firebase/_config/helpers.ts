'use server'

import { FirebaseErrorResponse } from '@/_gateway/firebase/_interfaces/firebase-error.response'
import { REQUEST_HEADERS } from '@/lib/constants/request-headers'
import { envLoader } from '@/lib/utils/env-loader'
import { AxiosError } from 'axios'
import { cookies } from 'next/headers'
import { v5 as uuidv5 } from 'uuid'

export const logFirebaseError = async (error: any) => {
  if (error instanceof AxiosError) {
    const firebaseError = error.response
      ?.data as FirebaseErrorResponse
    if (firebaseError) console.log(firebaseError)
  }
}

export const hasSessionCookie = async () => {
  try {
    const cookieStore = await cookies()
    return cookieStore.has(REQUEST_HEADERS.SESSION)
  } catch (error) {
    throw error
  }
}

export const getSessionCookie = async (): Promise<
  string | null
> => {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(REQUEST_HEADERS.SESSION)?.value
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
    cookieStore.set(REQUEST_HEADERS.SESSION, session, {
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
    cookieStore.delete(REQUEST_HEADERS.SESSION)
  } catch (error) {
    throw error
  }
}

export const createUserId = async (uid: string) => {
  try {
    return uuidv5(uid, envLoader.UuidNamespace)
  } catch (error) {
    throw error
  }
}

export const createHandle = async (base: string) => {
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
    const hash = hashHex.slice(0, 10)

    return 'user' + hash
  } catch (error) {
    throw error
  }
}
