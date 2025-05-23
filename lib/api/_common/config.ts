import { ErrorResponse } from '@/lib/api/_common/errors'
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY
} from '@/lib/constants/keys'
import {
  AxiosError
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
) => {
  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}

export const handleAxiosError = (error: AxiosError) => {
  if (error.response) {
    console.error(
      JSON.stringify(
        {
          status: error.response?.status,
          statusText: error.response?.statusText,
        },
        null,
        2,
      ),
    )
  } else {
    console.error('Backend error')
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
