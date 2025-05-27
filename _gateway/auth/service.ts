'use server'

import {
  clearTokens,
  setAccessToken,
  setRefreshToken,
} from '@/_gateway/_common/_config/helpers'
import {
  SignInServerPayload,
  SignUpServerPayload,
} from '@/_gateway/auth/internal/requests'
import {
  SignInServerResponse,
  SignUpServerResponse,
} from '@/_gateway/auth/internal/responses'
import {
  serverSignIn,
  serverSignUp,
} from '@/_gateway/auth/internal/transport'
import {
  SignInClientResponse,
  SignOutClientResponse,
  SignUpClientResponse,
} from '@/_gateway/auth/responses'
import { GetProfileServerResponse } from '@/_gateway/profiles/internal/responses'
import {
  serverGetProfile,
  serverUpsertProfile,
} from '@/_gateway/profiles/internal/transport'

export const gatewaySignIn = async (
  email: string,
  password: string,
): Promise<SignInClientResponse> => {
  try {
    const payload: SignInServerPayload = { email, password }

    const {
      user,
      accessToken,
      accessTokenExpires,
      refreshToken,
    }: SignInServerResponse = await serverSignIn(payload)

    const { profile }: GetProfileServerResponse =
      await serverGetProfile(user.id)

    await setAccessToken(accessToken, accessTokenExpires)
    await setRefreshToken(refreshToken)

    return {
      success: true,
      profile,
    } as SignInClientResponse
  } catch (error) {
    console.error(error)
    return { success: false } as SignInClientResponse
  }
}

export const gatewaySignUp = async (
  email: string,
  password: string,
  handle: string,
): Promise<SignUpClientResponse> => {
  try {
    const payload: SignUpServerPayload = {
      email,
      password,
      handle,
    }

    const { user }: SignUpServerResponse =
      await serverSignUp(payload)

    await serverUpsertProfile(user.id, {
      handle,
      email,
    })

    return { success: true } as SignUpClientResponse
  } catch (error) {
    console.error(error)
    return { success: false } as SignUpClientResponse
  }
}

export const gatewaySignOut =
  async (): Promise<SignOutClientResponse> => {
    try {
      await clearTokens()

      return { success: true } as SignOutClientResponse
    } catch (error) {
      console.error(error)
      return { success: false } as SignOutClientResponse
    }
  }
