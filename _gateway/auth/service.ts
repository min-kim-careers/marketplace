'use server'

import {
  clearTokens,
  handleAuthError,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from '@/_gateway/auth/_config/helpers'
import { logError } from '../_common/helpers'
import {
  internalGetProfile,
  internalUpsertProfile,
} from '@/_gateway/api/profiles/internal'
import { GetProfileInternalResponse } from '@/_gateway/api/profiles/internal/responses'
import {
  internalRefresh,
  internalSignIn,
  internalSignUp,
  internalVerify,
} from '@/_gateway/auth/internal'
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
import {
  RefreshServiceResponse,
  SignInServiceResponse,
  SignOutServiceResponse,
  SignUpServiceResponse,
  VerifyServiceResponse,
} from '@/_gateway/auth/responses'

export const serviceSignIn = async (
  email: string,
  password: string,
): Promise<SignInServiceResponse> => {
  try {
    const payload: SignInInternalPayload = {
      email,
      password,
    }

    const {
      user,
      accessToken,
      refreshToken,
    }: SignInInternalResponse =
      await internalSignIn(payload)

    const { profile }: GetProfileInternalResponse =
      await internalGetProfile(user.id)

    await setAccessToken(accessToken)
    await setRefreshToken(refreshToken)

    return {
      success: true,
      profile,
    } as SignInServiceResponse
  } catch (error) {
    logError(error)
    return { success: false } as SignInServiceResponse
  }
}

export const serviceSignUp = async (
  email: string,
  password: string,
  handle: string,
): Promise<SignUpServiceResponse> => {
  try {
    const payload: SignUpInternalPayload = {
      email,
      password,
      handle,
    }

    const { user }: SignUpInternalResponse =
      await internalSignUp(payload)

    await internalUpsertProfile(user.id, {
      handle,
      email,
    })

    return { success: true } as SignUpServiceResponse
  } catch (error) {
    logError(error)
    return { success: false } as SignUpServiceResponse
  }
}

export const serviceSignOut =
  async (): Promise<SignOutServiceResponse> => {
    try {
      await clearTokens()

      return { success: true } as SignOutServiceResponse
    } catch (error) {
      logError(error)
      return { success: false } as SignOutServiceResponse
    }
  }

export const serviceVerify =
  async (): Promise<VerifyServiceResponse> => {
    try {
      if (!(await getAccessToken())) {
        console.log(
          'No access token. Aborting verification.',
        )
        return { success: false }
      }

      await internalVerify()

      return { success: true }
    } catch (error) {
      const authError = handleAuthError(error)

      if (!authError || !authError.invalidToken) {
        logError(error)
        return { success: false }
      }

      return await serviceRefresh()
    }
  }

export const serviceRefresh =
  async (): Promise<RefreshServiceResponse> => {
    try {
      const refreshToken = await getRefreshToken()
      if (!refreshToken) {
        console.log('No refresh token. Aborting refresh.')
        return { success: false }
      }

      const payload: RefreshInternalPayload = {
        refreshToken,
      }

      const { accessToken }: RefreshInternalResponse =
        await internalRefresh(payload)

      await setAccessToken(accessToken)

      return { success: true }
    } catch (error) {
      logError(error)
      return { success: false }
    }
  }
