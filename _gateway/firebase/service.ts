'use server'

import {
  _getProfile,
  _upsertProfile,
} from '@/_gateway/api/profile/internal'
import {
  clearSessionCookie,
  createHandle,
  createUserId,
  getSessionCookie,
  logFirebaseError,
  setSessionCookie,
} from '@/_gateway/firebase/_config/helpers'
import {
  _getSession,
  _verifySession,
} from '@/_gateway/firebase/internal'
import { Profile } from '@/lib/interfaces/profile'
import { DecodedToken } from './internal'

export const signInWithGoogle = async (
  idToken: string,
): Promise<Profile> => {
  try {
    const {
      decodedToken,
      sessionCookie,
      expiresInSeconds,
    } = await _getSession(idToken)

    const userId = await createUserId(decodedToken.uid)

    const { profile: existingProfile } =
      await _getProfile(userId)

    if (existingProfile) {
      await setSessionCookie(
        sessionCookie,
        expiresInSeconds,
      )
      return existingProfile
    }

    const handle = await createHandle(decodedToken.uid)

    const { profile: newProfile } = await _upsertProfile(
      userId,
      {
        handle,
        email: decodedToken.email,
        avatarUrl: decodedToken.picture,
      },
    )

    await setSessionCookie(sessionCookie, expiresInSeconds)
    return newProfile
  } catch (error) {
    logFirebaseError(error)
    await clearSessionCookie()
    throw new Error()
  }
}

export const verifySession = async (
  session: string,
): Promise<DecodedToken> => {
  try {
    return {
      uid: 'eZ1oYyTnK7RVPC83HeonR30rjS83',
      email: 'user1@example.com',
      picture:
        'https://lh3.googleusercontent.com/a/ACg8ocJVq6R_VPqzjgbv4go2Gm7o9isHXUZ6K4GexJ2JzPF3TDoYvQ=s96-c',
    }

    const { decodedToken } = await _verifySession(session)

    return decodedToken
  } catch (error) {
    logFirebaseError(error)
    throw new Error()
  }
}

export const refreshSession = async (idToken: string) => {
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
    } = await _getSession(idToken)

    await setSessionCookie(sessionCookie, expiresInSeconds)
  } catch (error) {
    logFirebaseError(error)
    throw new Error()
  }
}

export const signOut = async (): Promise<void> => {
  try {
    await clearSessionCookie()
  } catch (error) {
    logFirebaseError(error)
    throw new Error()
  }
}
