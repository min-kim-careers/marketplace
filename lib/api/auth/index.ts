import { handleAxiosError } from '@/lib/api/_common/config'
import { ErrorResponse } from '@/lib/api/_common/errors'
import { ApiResponse } from '@/lib/api/_common/responses'
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/lib/constants/keys'
import { env } from '@/lib/utils/env'
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import { cookies } from 'next/headers'

// const fetchRefresh = async (
//   refresh_token: string,
// ): Promise<RefreshResponse> => {
//   try {
//     const res = await fetch(
//       env.serverUrl + ENDPOINTS.AUTH + '/refresh',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           [API_KEY_HEADER]: env.apiKey,
//         },
//         body: JSON.stringify({
//           refresh_token,
//         }),
//       },
//     )

//     if (!res.ok) {
//       const err: ErrorResponse = await res.json()
//       console.error('Error:', err.detail.errorType)
//       throw new Error()
//     }

//     const data = await res.json()

//     return data
//   } catch (error) {
//     console.error('Failed to refresh token')
//     throw new Error()
//   }
// }

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
) => {
  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}

const attachApiKey = (
  config: InternalAxiosRequestConfig,
) => {
  config.headers[env.authKeyHeader] = env.authKey
  return config
}

const attachToken = async (
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
    if (!accessToken && !!refreshToken) {
      //   const res = await fetchRefresh(refreshToken)
      //   setAccessToken(
      //     cookieStore,
      //     res.accessToken,
      //     res.accessTokenExpires,
      //   )
    }
    config.headers.Authorization = `Bearer ${accessToken}`
  } catch (error) {
    console.error('Failed to attach credentials')
  }
}

const attachCredentials = async (
  config: InternalAxiosRequestConfig,
) => {
  config = attachApiKey(config)
  return config
}

const authApi = axios.create({
  baseURL: env.authUrl,
})

authApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return attachCredentials(config)
  },
  (error: AxiosError) => {
    console.error('Auth Request Error:')
    handleAxiosError(error)
    return Promise.reject(error)
  },
)

authApi.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data as ApiResponse

    if (data.message)
      console.log('Auth message:', data.message)

    if (!data.success) throw new Error('Api response error')

    response.data = data.data

    return response
  },
  async (error: AxiosError) => {
    console.error('Auth Response Error:')
    const err = handleAxiosError(error)
    return !!err ? Promise.reject(err) : Promise.reject(error)
  },
)

export default authApi
