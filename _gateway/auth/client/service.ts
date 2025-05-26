'use server'

import {
  SignInClientResponse,
  SignOutClientResponse,
  SignUpClientResponse,
} from '@/_gateway/auth/client/responses'
import {
  SignInServerResponse,
  SignUpServerResponse,
} from '@/_gateway/auth/server/responses'
import {
  serverSignIn,
  serverSignUp,
} from '@/_gateway/auth/server/service'
import { GetProfileServerResponse } from '@/_gateway/profiles/server/responses'
import {
  serverGetProfile,
  serverUpsertProfile,
} from '@/_gateway/profiles/server/service'
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/lib/constants/keys'
import { cookies } from 'next/headers'

export const clientSignIn = async (
  email: string,
  password: string,
): Promise<SignInClientResponse> => {
  try {
    const authRes: SignInServerResponse =
      await serverSignIn(email, password)

    const profilesRes: GetProfileServerResponse =
      await serverGetProfile(authRes.user.id)

    return {
      success: true,
      profile: profilesRes.profile,
    } as SignInClientResponse
  } catch (error) {
    console.error('Auth Sign In Error:', error)
    return { success: false } as SignInClientResponse
  }
}

export const clientSignUp = async (
  email: string,
  password: string,
  handle: string,
): Promise<SignUpClientResponse> => {
  try {
    const authRes: SignUpServerResponse =
      await serverSignUp(email, password, handle)

    await serverUpsertProfile(authRes.user.id, handle, email)

    return { success: true } as SignUpClientResponse
  } catch (error) {
    console.error('Auth Sign Up Error:', error)
    return { success: false } as SignUpClientResponse
  }
}

export const clientSignOut =
  async (): Promise<SignOutClientResponse> => {
    try {
      const cookieStore = await cookies()

      cookieStore.delete(ACCESS_TOKEN_KEY)
      cookieStore.delete(REFRESH_TOKEN_KEY)

      return { success: true } as SignOutClientResponse
    } catch (error) {
      console.error('Auth Sign Out Error:', error)
      return { success: false } as SignOutClientResponse
    }
  }
