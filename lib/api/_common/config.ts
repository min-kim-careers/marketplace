import { ErrorResponse } from '@/lib/api/_common/errors'
import { RefreshServerResponse as RefreshResponse } from '@/lib/api/auth/responses'
import { ENDPOINTS } from '@/lib/constants/endpoints'
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/lib/constants/keys'
import { env } from '@/lib/utils/config'
import {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { cookies } from 'next/headers'

export const setAccessToken = (
  cookieStore: ReadonlyRequestCookies,
  accessToken: string,
  accessTokenExpires: number,
) => {
  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: accessTokenExpires,
  })
}

export const setRefreshToken = (
  cookieStore: ReadonlyRequestCookies,
  refreshToken: string,
  refreshTokenExpires: number,
) => {
  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: refreshTokenExpires,
  })
}

export const handleAxiosError = (error: AxiosError) => {
  console.error(
    JSON.stringify(
      {
        ...(error.response?.data as ErrorResponse),
        status: error.response?.status,
        statusText: error.response?.statusText,
      },
      null,
      2,
    ),
  )
}

const fetchRefresh = async (
  refresh_token: string,
): Promise<RefreshResponse> => {
  try {
    const res = await fetch(
      env.serverUrl + ENDPOINTS.AUTH + '/refresh',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-token': env.apiToken,
        },
        body: JSON.stringify({
          refresh_token,
        }),
      },
    )

    if (!res.ok) {
      const err: ErrorResponse = await res.json()
      console.error('Error:', err.detail.errorType)
      throw new Error()
    }

    const data = await res.json()

    return data
  } catch (error) {
    console.error('Failed to refresh token')
    throw new Error()
  }
}

export const attachCredentials = async (
  config: InternalAxiosRequestConfig,
) => {
  config.headers['x-api-token'] = env.apiToken

  try {
    const cookieStore = await cookies()
    let accessToken = cookieStore.get(
      ACCESS_TOKEN_KEY,
    )?.value
    const refreshToken = cookieStore.get(
      REFRESH_TOKEN_KEY,
    )?.value

    if (!accessToken && !!refreshToken) {
      const res = await fetchRefresh(refreshToken)
      setAccessToken(
        cookieStore,
        res.accessToken,
        res.accessTokenExpires,
      )
    }

    config.headers.Authorization = `Bearer ${accessToken}`
  } catch (error) {
    console.error('Failed to attach credentials')
  }

  return config
}
