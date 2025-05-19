'use server'

import { createApi, setAccessToken, setRefreshToken } from '@/lib/api/_common/config'
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

const authApi = createApi('')

export const signIn = async (
  email: string,
  password: string,
): Promise<SignInResponse> => {
  try {
    const data = new FormData()
    data.append('username', email)
    data.append('password', password)

    const cookieStore = await cookies()

    const serverRes: SignInServerResponse = (
      await authApi.post('/sign-in', data)
    ).data

    setAccessToken(
      cookieStore,
      serverRes.accessToken,
      serverRes.accessTokenExpires,
    )

    setRefreshToken(
      cookieStore,
      serverRes.refreshToken,
      serverRes.refreshTokenExpires,
    )


    const clientRes: SignInResponse = {
      profile: serverRes.profile,
    }

    return clientRes
  } catch (error) {
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
    .then((response) => response.data)
    .catch((error) => {
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

        const res: SignOutResponse = { success: true }
        return res
      })
      .catch((error) => {
        console.error('Server error')
        throw new Error()
      })
  }
