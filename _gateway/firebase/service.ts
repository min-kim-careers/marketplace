'use server'

import {
  InternalUpsertProfile,
  internalUpsertProfile,
} from '@/_gateway/api/profiles/internal'
import {
  clearTokens,
  setSessionCookie,
} from '@/_gateway/firebase/_config/helpers'
import { DecodedToken } from '@/_gateway/firebase/_models/token'
import {
  internalGetSession,
  InternalGetSession,
  internalVerify,
  InternalVerify,
} from '@/_gateway/firebase/internal'
import { Profile } from '@/lib/interfaces/profiles'
import { envLoader } from '@/lib/utils/env-loader'
import { v5 as uuidv5 } from 'uuid'
import { logError } from '../_common/helpers'

export const serviceSignInWithGoogle = async (
  idToken: string,
): Promise<Profile> => {
  try {
    const {
      decodedToken,
      sessionCookie,
      expiresInSeconds,
    }: InternalGetSession =
      await internalGetSession(idToken)

    const uuid = uuidv5(
      decodedToken.uid,
      envLoader.UuidNamespace,
    )

    const { profile }: InternalUpsertProfile =
      await internalUpsertProfile(uuid, decodedToken.email)

    await setSessionCookie(sessionCookie, expiresInSeconds)

    return profile
  } catch (error) {
    logError(error)
    throw new Error()
  }
}

export interface ServiceVerify {
  decodedToken: DecodedToken
  profileCreated: boolean
}

export const serviceVerify = async (
  session: string,
): Promise<ServiceVerify> => {
  try {
    const { decodedToken, profileCreated }: InternalVerify =
      await internalVerify(session)

    return { decodedToken, profileCreated }
  } catch (error) {
    logError(error)
    throw new Error()
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
