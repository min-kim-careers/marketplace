'use server'

import {
  clearSessionCookie,
  createHandle,
  createUserId,
  getSessionCookie,
  logFirebaseError,
  setSessionCookie,
} from '@/_gateway/firebase/_config/helpers'
import { Profile } from '@/lib/interfaces/profile'
import { DecodedToken } from './interfaces'
import { FIREBASE_ENDPOINTS } from '@/_gateway/firebase/endpoints'
import { PROFILE_ENDPOINTS } from '@/_gateway/api/profile/endpoints'

export const signInWithGoogle = async (
  idToken: string,
): Promise<Profile> => {
  try {
    const {
      decodedToken,
      sessionCookie,
      expiresInSeconds,
    } = await FIREBASE_ENDPOINTS.GET_SESSION(idToken)

    const userId = await createUserId(decodedToken.uid)

    const { profile: existingProfile } =
      await PROFILE_ENDPOINTS.GET_PROFILE(userId)

    if (existingProfile) {
      await setSessionCookie(
        sessionCookie,
        expiresInSeconds,
      )
      return existingProfile
    }

    const handle = await createHandle(decodedToken.uid)

    const { profile: newProfile } =
      await PROFILE_ENDPOINTS.UPSERT_PROFILE(userId, {
        handle,
        email: decodedToken.email,
        avatarUrl: decodedToken.picture,
      })

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

    const { decodedToken } =
      await FIREBASE_ENDPOINTS.VERIFY_SESSION(session)

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
    } = await FIREBASE_ENDPOINTS.GET_SESSION(idToken)

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
