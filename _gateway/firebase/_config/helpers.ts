import { HEADERS } from '@/lib/constants/headers'
import { envLoader } from '@/lib/utils/env-loader'
import {
  InternalAxiosRequestConfig
} from 'axios'
import { cookies } from 'next/headers'
import { v5 as uuidv5 } from 'uuid'


export const getSessionCookie = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(HEADERS.SESSION)?.value
}

export const setSessionCookie = async (
  session: string,
  expiresInSeconds: number,
) => {
  const cookieStore = await cookies()
  cookieStore.set(HEADERS.SESSION, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: expiresInSeconds,
  })
}

export const clearTokens = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(HEADERS.SESSION)
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
