'use server'

import {
  internalGetProfile,
  internalUpsertProfile,
} from '@/_gateway/api/profiles/internal'
import {
  clearSessionCookie,
  generateHandle,
  getSessionCookie,
  setSessionCookie,
  uidToUuid,
} from '@/_gateway/firebase/_config/helpers'
import { DecodedToken } from '@/_gateway/firebase/_models/decoded-token'
import {
  internalGetSession,
  InternalGetSession,
  internalVerifySession,
  InternalVerifySession,
} from '@/_gateway/firebase/internal'
import { Profile } from '@/lib/interfaces/profiles'
import { logError } from '../_common/helpers'
import { cleanPayload } from '@/lib/common'

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

    const { profile: existingProfile } =
      await internalGetProfile(userId)

    if (existingProfile) {
      await setSessionCookie(
        sessionCookie,
        expiresInSeconds,
      )
      return { profile: existingProfile }
    }

    const handle = await generateHandle(decodedToken.uid)

    const { profile: newProfile } =
      await internalUpsertProfile(userId, cleanPayload({
        handle,
        email: decodedToken.email,
        avatarUrl: decodedToken.picture,
      }))

    await setSessionCookie(sessionCookie, expiresInSeconds)
    return { profile: newProfile }
  } catch (error) {
    logError(error)
    await clearSessionCookie()
    throw new Error()
  }
}

export interface ServiceVerifySession {
  decodedToken: DecodedToken
}

export const serviceVerifySession = async (
  session: string,
): Promise<ServiceVerifySession> => {
  try {
    const { decodedToken }: InternalVerifySession =
      await internalVerifySession(session)

    return { decodedToken } as ServiceVerifySession
  } catch (error) {
    logError(error)
    throw new Error()
  }
}

export const serviceRefreshSession = async (
  idToken: string,
) => {
  try {
    const session = await getSessionCookie()
    if (session) {
      console.log('Session already exists. Aborting refresh.');
      return
    }

    const {
      // decodedToken,
      sessionCookie,
      expiresInSeconds,
    }: InternalGetSession =
      await internalGetSession(idToken)

    await setSessionCookie(sessionCookie, expiresInSeconds)
  } catch (error) {
    logError(error)
    throw new Error()
  }
}

export const serviceSignOut = async (): Promise<void> => {
  try {
    await clearSessionCookie()
  } catch (error) {
    logError(error)
    throw new Error()
  }
}
