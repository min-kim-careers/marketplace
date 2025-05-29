'use server'

import { authAxios } from '@/_gateway/auth/_config/axios'
import {
  RefreshInternalPayload,
  SignInInternalPayload,
  SignUpInternalPayload,
} from '@/_gateway/auth/internal/requests'
import {
  RefreshInternalResponse,
  SignInInternalResponse,
  SignUpInternalResponse,
} from '@/_gateway/auth/internal/responses'
import { AUTH_ENDPOINTS } from '../_config/endpoints'

export const internalSignIn = async (
  payload: SignInInternalPayload,
): Promise<SignInInternalResponse> => {
  try {
    const response = await authAxios.post(
      AUTH_ENDPOINTS.SIGN_IN,
      payload,
    )
    const {
      user,
      accessToken,
      refreshToken,
    }: SignInInternalResponse = response.data

    if (!user) throw new Error('No user returned')
    if (!accessToken)
      throw new Error('Missing access token')
    if (!refreshToken)
      throw new Error('Missing refresh token')

    return response.data
  } catch (error) {
    throw error
  }
}

export const internalSignUp = async (
  payload: SignUpInternalPayload,
): Promise<SignUpInternalResponse> => {
  try {
    const response = await authAxios.post(
      AUTH_ENDPOINTS.SIGN_UP,
      payload,
    )

    const { user }: SignUpInternalResponse = response.data

    if (!user) throw new Error('No user returned')

    return response.data
  } catch (error) {
    throw error
  }
}

export const internalVerify = async (): Promise<void> => {
  try {
    await authAxios.post(AUTH_ENDPOINTS.VERIFY)
  } catch (error) {
    throw error
  }
}

export const internalRefresh = async (
  payload: RefreshInternalPayload,
): Promise<RefreshInternalResponse> => {
  try {
    const response = await authAxios.post(
      AUTH_ENDPOINTS.REFRESH,
      payload,
    )

    const {
      accessToken,
    }: RefreshInternalResponse = response.data

    if (!accessToken)
      throw new Error('Missing access token')

    return response.data
  } catch (error) {
    throw error
  }
}
