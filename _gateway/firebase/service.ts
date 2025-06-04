'use server'

import { serviceGetProfile } from '@/_gateway/api/profiles/service'
import {
  clearTokens,
  getSessionCookie,
  setSessionCookie,
  uidToUuid,
} from '@/_gateway/firebase/_config/helpers'
import { DecodedToken } from '@/_gateway/firebase/_models/token'
import {
  internalGetSession,
  InternalGetSession,
  internalVerify,
  InternalVerify,
} from '@/_gateway/firebase/internal'
import { Profile } from '@/lib/interfaces/profiles'
import { logError } from '../_common/helpers'

export interface ServiceSignInWithGoogle {
  profile: Profile
}

export const serviceSignInWithGoogle = async (
  idToken: string,
): Promise<ServiceSignInWithGoogle> => {
  try {
    const {
      decodedToken,
      sessionCookie,
      expiresInSeconds,
    }: InternalGetSession =
      await internalGetSession(idToken)

    const userId = uidToUuid(decodedToken.uid)
    const profile = await serviceGetProfile(userId)
    if (!profile) throw new Error('Profile missing')

    await setSessionCookie(sessionCookie, expiresInSeconds)

    return { profile }
  } catch (error) {
    logError(error)
    throw new Error()
  }
}

export interface ServiceVerify {
  decodedToken: DecodedToken | null
}

export const serviceVerify = async (
  session: string,
): Promise<ServiceVerify> => {
  try {
    const { decodedToken }: InternalVerify =
      await internalVerify(session)

    return { decodedToken } as ServiceVerify

    // return {
    //   decodedToken: {
    //     uid: 'rXR4AMqRIcgyvVnLjXbShNjfaMS2',
    //     picture:
    //       'https://lh3.googleusercontent.com/a/ACg8ocJVq6R_VPqzjgbv4go2Gm7o9isHXUZ6K4GexJ2JzPF3TDoYvQ=s96-c',
    //     email: 'user1@example.com',
    //     claims: {
    //       profile_created: false,
    //     },
    //   },
    // }
  } catch (error) {
    logError(error)
    return { decodedToken: null }
  }
}

export const serviceSignOut = async (): Promise<void> => {
  try {
    await clearTokens()
  } catch (error) {
    logError(error)
    throw new Error()
  }
}
