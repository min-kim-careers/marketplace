import { logError } from '@/_gateway/_common/helpers'
import { HEADERS } from '@/lib/constants/headers'
import { envLoader } from '@/lib/utils/env-loader'
import { InternalAxiosRequestConfig } from 'axios'
import { cookies } from 'next/headers'
import { v5 as uuidv5 } from 'uuid'

export const hasSessionCookie =
  async (): Promise<boolean> => {
    const cookieStore = await cookies()
    return cookieStore.has(HEADERS.SESSION)
  }

export const getSessionCookie = async (): Promise<
  string | null
> => {
  const cookieStore = await cookies()
  return cookieStore.get(HEADERS.SESSION)?.value ?? null
}

export const setSessionCookie = async (
  session: string,
  expiresInSeconds: number,
): Promise<boolean> => {
  try {
    const cookieStore = await cookies()
    cookieStore.set(HEADERS.SESSION, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expiresInSeconds,
    })
    return true
  } catch (error) {
    logError(error)
    return false
  }
}

export const clearTokens = async (): Promise<boolean> => {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(HEADERS.SESSION)
    return true
  } catch (error) {
    logError(error)
    return false
  }
}

export const attachCredentials = async (
  config: InternalAxiosRequestConfig,
) => {
  try {
    const session = await getSessionCookie()
    if (session) {
      config.headers.Authorization = `Bearer ${session}`
    }
  } catch (error) {
    console.error('Error attaching token:', error)
  }
}

export const uidToUuid = (uid: string) => {
  return uuidv5(uid, envLoader.UuidNamespace)
}
