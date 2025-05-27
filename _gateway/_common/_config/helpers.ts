import { serverRefresh } from '@/_gateway/auth/internal/transport'
import {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { cookies } from 'next/headers'

const ACCESS_TOKEN_KEY = 'access_token'

export const setAccessToken = async (
  accessToken: string,
  accessTokenExpires: number,
) => {
  const cookieStore = await cookies()
  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: accessTokenExpires,
  })
}

const REFRESH_TOKEN_KEY = 'refresh_token'

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

export const attachToken = async (
  config: InternalAxiosRequestConfig,
) => {
  try {
    const cookieStore = await cookies()

    let accessToken = cookieStore.get(
      ACCESS_TOKEN_KEY,
    )?.value
    const refreshToken = cookieStore.get(
      REFRESH_TOKEN_KEY,
    )?.value

    if (!accessToken && refreshToken) {
      await serverRefresh()
      accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
  } catch (error) {
    console.error('Token handling failed:', error)
  }
}

export const throwServerError = (error: AxiosError) => {
  const errData = error?.response?.data as any
  if (errData) {
    const message = errData?.detail?.message
    console.error(message)

    const userMessage = errData.detail.userMessage
    throw new Error(userMessage)
  }
}
