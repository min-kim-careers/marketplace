'use server'

import { ErrorResponse } from '@/lib/api/_common/errors'
import {
  setAccessToken,
  setRefreshToken,
} from '@/lib/api/auth'
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
import { Profile } from '@/lib/interfaces/profiles'
import { cookies } from 'next/headers'

const setTokensOnSignIn = async (
  authRes: SignInServerResponse,
) => {
  const cookieStore = await cookies()
  setAccessToken(
    cookieStore,
    authRes.accessToken,
    authRes.accessTokenExpires,
  )
  setRefreshToken(cookieStore, authRes.refreshToken)
}

export const signIn = async (
  email: string,
  password: string,
): Promise<SignInResponse> => {
  try {
    const data = new FormData()
    data.append('username', email)
    data.append('password', password)

    const authRes: SignInServerResponse = (
      await authApi.post('/sign-in', data)
    ).data

    setTokensOnSignIn(authRes)

    const profile: Profile = {
      handle: 'string',
      email: 'string',
      rating: 0,
      ratingCount: 0,
      suburb: 'string',
      state: 'string',
      avatarUrl: 'string',
    }
    if (!profile) {
      console.error('Failed to fetch profile')
      throw new Error()
    }

    return { success: true, profile } as SignInResponse
  } catch (_) {
    console.error('Server Side Error')
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
    .catch((e: ErrorResponse) => {
      console.error('Server Side Error')
      if (e.detail.userSafe) {
        throw new Error(e.detail.message)
      }
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
        console.error('Server Side Error')
        throw new Error()
      })
  }
