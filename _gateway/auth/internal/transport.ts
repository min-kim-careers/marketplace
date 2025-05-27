'use server'

import { authAxios } from '@/_gateway/_common/_config/axios/auth'
import { AUTH_ENDPOINTS } from '@/_gateway/_common/_config/endpoints'
import { setAccessToken } from '@/_gateway/_common/_config/helpers'
import {
  SignInServerPayload,
  SignUpServerPayload,
} from '@/_gateway/auth/internal/requests'
import {
  RefreshServerResponse,
  SignInServerResponse,
  SignUpServerResponse,
} from '@/_gateway/auth/internal/responses'

export const serverSignIn = async (
  payload: SignInServerPayload,
): Promise<SignInServerResponse> => {
  try {
    const response = await authAxios.post(
      AUTH_ENDPOINTS.SIGN_IN,
      payload,
    )
    const {
      user,
      accessToken,
      accessTokenExpires,
      refreshToken,
    } = response.data

    if (!user) throw new Error('No user returned')
    if (!accessToken)
      throw new Error('Missing access token')
    if (!accessTokenExpires)
      throw new Error('Missing token expiry')
    if (!refreshToken)
      throw new Error('Missing refresh token')

    return response.data
  } catch (error: any) {
    console.error('Server Sign In failed')
    throw error
  }
}

export const serverSignUp = async (
  payload: SignUpServerPayload,
): Promise<SignUpServerResponse> => {
  try {
    const response = await authAxios.post(
      AUTH_ENDPOINTS.SIGN_UP,
      payload,
    )

    const { user }: SignUpServerResponse = response.data

    if (!user) throw new Error('No user returned')

    return response.data
  } catch (error) {
    console.error('Server Sign Up failed')
    throw error
  }
}

export const serverVerify = async (): Promise<void> => {
  try {
    await authAxios.post(AUTH_ENDPOINTS.VERIFY)
  } catch (error) {
    console.error('Server verify failed')
    throw error
  }
}

export const serverRefresh = async (): Promise<void> => {
  try {
    const response = await authAxios.post(
      AUTH_ENDPOINTS.REFRESH,
    )

    const {
      accessToken,
      accessTokenExpires,
    }: RefreshServerResponse = response.data

    if (!accessToken)
      throw new Error('Missing access token')
    if (!accessTokenExpires)
      throw new Error('Missing token expiry')

    await setAccessToken(accessToken, accessTokenExpires)
  } catch (error) {
    console.error('Server refresh failed')
    throw error
  }
}
