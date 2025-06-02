import { envLoader } from '@/lib/utils/env-loader'
import {
  InternalAxiosRequestConfig
} from 'axios'
import { cookies } from 'next/headers'
import { v5 as uuidv5 } from 'uuid'

const SESSION_KEY = '__session'

export const getSessionCookie = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_KEY)?.value
}

export const setSessionCookie = async (
  session: string,
  expiresInSeconds: number,
) => {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_KEY, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresInSeconds,
  })
}

export const clearTokens = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_KEY)
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
