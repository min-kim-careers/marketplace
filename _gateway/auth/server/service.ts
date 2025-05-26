'use server'

import { AUTH_ENDPOINTS } from '@/_gateway/auth/_common/endpoints'
import { setAccessToken } from '@/_gateway/auth/_common/helpers'
import authApi from '@/_gateway/auth/_config'
import { SignUpPayload } from '@/_gateway/auth/server/requests'
import {
  RefreshServerResponse,
  SignInServerResponse,
  SignUpServerResponse,
} from '@/_gateway/auth/server/responses'
import { cookies } from 'next/headers'

export const serverSignIn = async (
  email: string,
  password: string,
): Promise<SignInServerResponse> => {
  const data = new FormData()
  data.append('username', email)
  data.append('password', password)

  return await authApi
    .post(AUTH_ENDPOINTS.SIGN_IN, data)
    .then(
      (response) => response.data as SignInServerResponse,
    )
    .catch((error) => {
      console.error('Auth Server Sign In Error:', error)
      throw error
    })
}

export const serverSignUp = async (
  email: string,
  password: string,
  handle: string,
): Promise<SignUpServerResponse> => {
  const payload: SignUpPayload = {
    email,
    password,
    handle,
  }

  return await authApi
    .post(AUTH_ENDPOINTS.SIGN_UP, payload)
    .then(
      (response) => response.data as SignUpServerResponse,
    )
    .catch((error) => {
      console.error('Auth Server Sign Up Error:', error)
      throw error
    })
}

export const serverVerify = async (): Promise<boolean> => {
  return await authApi
    .post(AUTH_ENDPOINTS.VERIFY)
    .then(() => true)
    .catch((error) => {
      console.error('Auth Server Verify Error:', error)
      return false
    })
}

export const serverRefresh = async (): Promise<void> => {
  return await authApi
    .post(AUTH_ENDPOINTS.REFRESH)
    .then(async (response) => {
      const cookieStore = await cookies()

      const authRes: RefreshServerResponse = response.data

      setAccessToken(
        cookieStore,
        authRes.accessToken,
        authRes.accessTokenExpires,
      )
    })
    .catch((error) => {
      console.error('Auth Server Refresh Error:', error)
    })
}
