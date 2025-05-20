'use server'

import {
  setAccessToken,
  setRefreshToken,
} from '@/lib/api/_common/config'
import authApi from '@/lib/api/auth'
import {
  SignInResponse,
  SignInServerResponse,
  SignOutResponse,
  SignUpResponse,
} from '@/lib/api/auth/responses'
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/lib/constants/keys'
import { cookies } from 'next/headers'

export const signIn = async (
  email: string,
  password: string,
): Promise<SignInResponse> => {
  try {
    const data = new FormData()
    data.append('username', email)
    data.append('password', password)

    const cookieStore = await cookies()

    const authRes: SignInServerResponse = (
      await authApi.post('/sign-in', data)
    ).data

    setAccessToken(
      cookieStore,
      authRes.accessToken,
      authRes.accessTokenExpires,
    )

    setRefreshToken(cookieStore, authRes.refreshToken)

    return { success: true } as SignInResponse
  } catch (_) {
    console.error('Server error')
    throw new Error()
  }
}

export const signUp = async (
  email: string,
  password: string,
  handle: string,
): Promise<SignUpResponse> => {
  const data = { email, password, handle }

  return await authApi
    .post('/sign-up', data)
    .then(() => ({ success: true }) as SignUpResponse)
    .catch(() => {
      console.error('Server error')
      throw new Error()
    })
}

export const signOut =
  async (): Promise<SignOutResponse> => {
    return await cookies()
      .then((cookieStore) => {
        cookieStore.delete(ACCESS_TOKEN_KEY)
        cookieStore.delete(REFRESH_TOKEN_KEY)

        return { success: true } as SignOutResponse
      })
      .catch(() => {
        console.error('Server error')
        throw new Error()
      })
  }
