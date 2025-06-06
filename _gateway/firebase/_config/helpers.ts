import { logError } from '@/_gateway/_common/helpers'
import { HEADERS } from '@/lib/constants/headers'
import { envLoader } from '@/lib/utils/env-loader'
import { cookies } from 'next/headers'
import { v5 as uuidv5 } from 'uuid'

export const hasSessionCookie = async () => {
  try {
    const cookieStore = await cookies()
    return cookieStore.has(HEADERS.SESSION)
  } catch (error) {
    throw error
  }
}

export const getSessionCookie = async (): Promise<
  string | null
> => {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(HEADERS.SESSION)?.value
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
    cookieStore.set(HEADERS.SESSION, session, {
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
    cookieStore.delete(HEADERS.SESSION)
  } catch (error) {
    throw error
  }
}

export const uidToUuid = (uid: string) => {
  try {
    return uuidv5(uid, envLoader.UuidNamespace)
  } catch (error) {
    throw error
  }
}

export const generateHandle = async (base: string) => {
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
