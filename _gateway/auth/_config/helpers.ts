import { AuthError } from '@/_gateway/auth/_config/error'
import {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { cookies } from 'next/headers'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const getAccessToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value
}

export const setAccessToken = async (
  accessToken: string,
) => {
  const cookieStore = await cookies()
  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}

export const getRefreshToken = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value
}

export const setRefreshToken = async (
  refreshToken: string,
) => {
  const cookieStore = await cookies()
  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}

export const clearTokens = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_KEY)
  cookieStore.delete(REFRESH_TOKEN_KEY)
}

export const attachAccessToken = async (
  config: InternalAxiosRequestConfig,
) => {
  try {
    const accessToken = await getAccessToken()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
  } catch (error) {
    console.error('Error attaching token:', error)
  }
}

export const handleAuthError = (
  error: any,
): AuthError | null => {
  if (error instanceof AxiosError) {
    const errData = error?.response?.data as any
    console.error(
      JSON.stringify({ authError: errData }, null, 2),
    )
    if (errData.detail) return errData.detail as AuthError
  }
  return null
}
