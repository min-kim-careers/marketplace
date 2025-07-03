'use server'

import { logApiError } from '@/_gateway/api/_config/helpers'
import * as PROFILE_ENDPOINTS from '@/_gateway/api/profile/endpoints'
import {
  clearSessionCookie,
  createHandle,
  logAuthError,
  setSessionCookie
} from '@/_gateway/auth/_config/helpers'
import * as AUTH_ENDPOINTS from '@/_gateway/auth/firebase/endpoints'
import { IProfile } from '@/lib/interfaces/profile'

export const SIGN_IN_WITH_GOOGLE = async (
  idToken: string,
): Promise<IProfile> => {
  try {
    const {
      userId,
      firebaseUser,
      sessionCookie,
      expiresInSeconds,
    } = await AUTH_ENDPOINTS._GET_SESSION(idToken)

    try {
      const { profile } =
        await PROFILE_ENDPOINTS._GET_PROFILE(userId)

      if (profile) {
        await setSessionCookie(
          sessionCookie,
          expiresInSeconds,
        )
        return profile
      }
    } catch (error) {
      logApiError(error)
      console.log('Creating new profile')
    }

    const handle = await createHandle(firebaseUser.uid)

    const { profile: newProfile } =
      await PROFILE_ENDPOINTS._UPSERT_PROFILE(userId, {
        handle,
        email: firebaseUser.email,
        avatarUrl: firebaseUser.picture,
      })

    await setSessionCookie(sessionCookie, expiresInSeconds)
    return newProfile
  } catch (error) {
    logAuthError(error)
    await clearSessionCookie()
    throw new Error()
  }
}

export const VERIFY_SESSION = async (
  session: string,
): Promise<string> => {
  try {
    const { userId } =
      await AUTH_ENDPOINTS._VERIFY_SESSION(session)

    return userId
  } catch (error) {
    logAuthError(error)
    throw new Error()
  }
}

export const SIGN_OUT = async (): Promise<void> => {
  try {
    await clearSessionCookie()
  } catch (error) {
    logAuthError(error)
    throw new Error()
  }
}
