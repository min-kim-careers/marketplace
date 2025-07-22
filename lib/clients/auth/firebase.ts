'use server'

import { Profile } from '@/lib/interfaces/profile'

export const SIGN_IN_WITH_GOOGLE = async (
  idToken: string,
): Promise<Profile> => {
  throw new Error()
  // try {
  //   const {
  //     userId,
  //     firebaseUser,
  //     sessionCookie,
  //     expiresInSeconds,
  //   } = await AUTH_ENDPOINTS._GET_SESSION(idToken)

  //   try {
  //     const { profile } =
  //       await PROFILE_ENDPOINTS._GET_PROFILE(userId)

  //     if (profile) {
  //       await setSessionCookie(
  //         sessionCookie,
  //         expiresInSeconds,
  //       )
  //       return profile
  //     }
  //   } catch (error) {
  //     console.log('Creating new profile')
  //   }

  //   const handle = await createHandle(firebaseUser.uid)

  //   const { profile: newProfile } =
  //     await PROFILE_ENDPOINTS._UPSERT_PROFILE(userId, {
  //       handle,
  //       email: firebaseUser.email,
  //       avatarUrl: firebaseUser.picture,
  //     })

  //   await setSessionCookie(sessionCookie, expiresInSeconds)
  //   return newProfile
  // } catch (error) {
  //   await clearSessionCookie()
  //   throw new Error()
  // }
}

export const VERIFY_SESSION = async (
  session: string,
): Promise<string> => {
  throw new Error()
  // try {
  //   const { userId } =
  //     await AUTH_ENDPOINTS._VERIFY_SESSION(session)

  //   return userId
  // } catch (error) {
  //   throw new Error()
  // }
}

export const SIGN_OUT = async (): Promise<void> => {
  // try {
  //   await clearSessionCookie()
  // } catch (error) {
  //   throw new Error()
  // }
}
