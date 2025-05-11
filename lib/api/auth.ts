'use server'

import {
  AuthResponseClient
} from '@/lib/interfaces/auth'
import { cookies } from 'next/headers'
import { ENDPOINTS } from '../constants/endpoints'
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '../constants/keys'
import { createApi } from './_common'

const authApi = createApi(ENDPOINTS.AUTH)

export const authenticate = async (): Promise<boolean> => {
  const cookieStore = await cookies()
  const token = cookieStore.get(ACCESS_TOKEN_KEY)

  if (!token) return false

  const data = { ACCESS_TOKEN_KEY: token }
  return await authApi
    .post('/token', data)
    .then((res) => res.data)
    .catch((error) => {
      console.error(error)
      return false
    })
}

export const signIn = async (
  email: string,
  password: string,
): Promise<AuthResponseClient> => {
  try {
    const data = new FormData()
    data.append('username', email)
    data.append('password', password)

    const cookieStore = await cookies()

    const authRes = (await authApi.post('/sign-in', data))
      .data

    cookieStore.set(ACCESS_TOKEN_KEY, authRes.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: authRes.accessTokenExpires,
    })

    cookieStore.set(
      REFRESH_TOKEN_KEY,
      authRes.refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: authRes.refreshTokenExpires,
      },
    )

    return {
      profile: authRes.profile
    } as AuthResponseClient
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const signOut = async (): Promise<boolean> => {
  return await cookies()
    .then((cookieStore) => {
      cookieStore.delete(ACCESS_TOKEN_KEY)
      cookieStore.delete(REFRESH_TOKEN_KEY)
      return true
    })
    .catch((error) => {
      console.error(error)
      return false
    })
}
