import { ErrorResponse } from '@/lib/api/_common/errors'
import { ApiResponse } from '@/lib/api/_common/responses'
import {
  ACCESS_TOKEN_KEY,
  API_KEY_HEADER,
  REFRESH_TOKEN_KEY,
} from '@/lib/constants/keys'
import { env } from '@/lib/utils/config'
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

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
  const res = error.response
  if (res) {
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
  } else {
    console.error('Api error')
  }
}

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

export const attachCredentials = async (
  config: InternalAxiosRequestConfig,
) => {
  config.headers[API_KEY_HEADER] = env.apiKey

  // try {
  //   const cookieStore = await cookies()
  //   let accessToken = cookieStore.get(
  //     ACCESS_TOKEN_KEY,
  //   )?.value
  //   const refreshToken = cookieStore.get(
  //     REFRESH_TOKEN_KEY,
  //   )?.value

  //   if (!accessToken && !!refreshToken) {
  //     const res = await fetchRefresh(refreshToken)
  //     setAccessToken(
  //       cookieStore,
  //       res.accessToken,
  //       res.accessTokenExpires,
  //     )
  //   }

  //   config.headers.Authorization = `Bearer ${accessToken}`
  // } catch (error) {
  //   console.error('Failed to attach credentials')
  // }

  return config
}

export const createApi = (endpoint: string) => {
  const api = axios.create({
    baseURL: env.serverUrl + endpoint,
  })

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      return attachCredentials(config)
    },
    (error: AxiosError) => {
      handleAxiosError(error)
      return Promise.reject(error)
    },
  )

  api.interceptors.response.use(
    (response: AxiosResponse) => {
      const data = response.data as ApiResponse

      console.log('Message:', data.message);
      
      if (!data.success) throw new Error('Api response error')

      response.data = data.data

      return response
    },
    async (error: AxiosError) => {
      handleAxiosError(error)
      return Promise.reject(error)
    },
  )

  return api
}
