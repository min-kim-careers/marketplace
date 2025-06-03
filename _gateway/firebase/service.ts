'use server'

import {
  clearTokens,
  setSessionCookie,
} from '@/_gateway/firebase/_config/helpers'
import { DecodedToken } from '@/_gateway/firebase/_models/token'
import {
  internalGetSession,
  InternalGetSession,
} from '@/_gateway/firebase/internal'
import { ROUTES } from '@/lib/constants/routes'
import { envLoader } from '@/lib/utils/env-loader'
import { redirect } from 'next/navigation'
import { v5 as uuidv5 } from 'uuid'
import { logError } from '../_common/helpers'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

const uidToUuid = (uid: string) =>
  uuidv5(uid, envLoader.UuidNamespace)

export const serviceSignInWithGoogle = async (
  idToken: string,
): Promise<void> => {
  try {
    const {
      decodedToken,
      sessionCookie,
      expiresInSeconds,
    }: InternalGetSession =
      await internalGetSession(idToken)

    await setSessionCookie(sessionCookie, expiresInSeconds)

    if (!decodedToken.claims.profile_created)
      redirect(ROUTES.PROFILE_COMPLETE)
  } catch (error) {
    if (isRedirectError(error)) throw error
    logError(error)
    throw new Error()
  }
}

export interface ServiceVerify {
  decodedToken: DecodedToken
}

export const serviceVerify = async (
  session: string,
): Promise<ServiceVerify> => {
  try {
    // const { decodedToken }: InternalVerify =
    //   await internalVerify(session)

    return {
      decodedToken: {
        uid: 'rXR4AMqRIcgyvVnLjXbShNjfaMS2',
        picture:
          'https://lh3.googleusercontent.com/a/ACg8ocJVq6R_VPqzjgbv4go2Gm7o9isHXUZ6K4GexJ2JzPF3TDoYvQ=s96-c',
        email: 'user1@example.com',
        claims: {
          profile_created: false,
        },
      },
    }
  } catch (error) {
    logError(error)
    throw new Error()
  }
}

export const serviceSignOut = async (): Promise<void> => {
  try {
    await clearTokens()

    redirect(ROUTES.HOME)
  } catch (error) {
    if (isRedirectError(error)) throw error
    logError(error)
    throw new Error()
  }
}
