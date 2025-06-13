'use server'

import {
  internalGetProfile,
  internalUpsertProfile,
} from '@/_gateway/api/profile/internal'
import {
  clearSessionCookie,
  createHandle,
  getSessionCookie,
  setSessionCookie,
  createUserId,
} from '@/_gateway/firebase/_config/helpers'
import { DecodedToken } from '@/_gateway/firebase/_interfaces/decoded-token'
import {
  internalGetSession,
  internalVerifySession,
} from '@/_gateway/firebase/internal'
import { Profile } from '@/lib/interfaces/profile'
import { logFirebaseError } from '@/_gateway/firebase/_config/helpers'
import { cleanPayload } from '@/lib/common/utils'

export interface ServiceSignInWithGoogle {
  profile: Profile
}

export const serviceSignInWithGoogle = async (
  idToken: string,
): Promise<Profile> => {
  try {
    const {
      decodedToken,
      sessionCookie,
      expiresInSeconds,
    } = await internalGetSession(idToken)

    const userId = await createUserId(decodedToken.uid)

    const { profile: existingProfile } =
      await internalGetProfile(userId)

    if (existingProfile) {
      await setSessionCookie(
        sessionCookie,
        expiresInSeconds,
      )
      return existingProfile
    }

    const handle = await createHandle(decodedToken.uid)

    const { profile: newProfile } =
      await internalUpsertProfile(
        userId,
        cleanPayload({
          handle,
          email: decodedToken.email,
          avatarUrl: decodedToken.picture,
        }),
      )

    await setSessionCookie(sessionCookie, expiresInSeconds)
    return newProfile
  } catch (error) {
    logFirebaseError(error)
    await clearSessionCookie()
    throw new Error()
  }
}

export const serviceVerifySession = async (
  session: string,
): Promise<DecodedToken> => {
  try {
    return {
      uid: 'eZ1oYyTnK7RVPC83HeonR30rjS83',
      email: 'user1@example.com',
      picture:
        'https://lh3.googleusercontent.com/a/ACg8ocJVq6R_VPqzjgbv4go2Gm7o9isHXUZ6K4GexJ2JzPF3TDoYvQ=s96-c',
    }

    const { decodedToken } =
      await internalVerifySession(session)

    return decodedToken
  } catch (error) {
    logFirebaseError(error)
    throw new Error()
  }
}

export const serviceRefreshSession = async (
  idToken: string,
) => {
  try {
    const session = await getSessionCookie()
    if (session) {
      console.log(
        'Session already exists. Aborting refresh.',
      )
      return
    }

    const {
      // decodedToken,
      sessionCookie,
      expiresInSeconds,
    } = await internalGetSession(idToken)

    await setSessionCookie(sessionCookie, expiresInSeconds)
  } catch (error) {
    logFirebaseError(error)
    throw new Error()
  }
}

export const serviceSignOut = async (): Promise<void> => {
  try {
    await clearSessionCookie()
  } catch (error) {
    logFirebaseError(error)
    throw new Error()
  }
}
