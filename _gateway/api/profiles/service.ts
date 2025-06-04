'use server'

import { logError } from '@/_gateway/_common/helpers'
import {
  InternalGetProfile,
  internalGetProfile,
  internalUpsertProfile,
  InternalUpsertProfile,
} from '@/_gateway/api/profiles/internal'
import { uidToUuid } from '@/_gateway/firebase/_config/helpers'
import { internalSetProfileCreated } from '@/_gateway/firebase/internal'
import { Profile } from '@/lib/interfaces/profiles'

export const serviceUpsertProfile = async (
  idToken: string,
  userId: string,
  email: string,
  handle?: string,
) => {
  try {
    const uid = uidToUuid(userId)

    const { profile }: InternalUpsertProfile =
      await internalUpsertProfile(uid, email, handle)

    const { decodedToken } =
      await internalSetProfileCreated(idToken)

    return { decodedToken, profile }
  } catch (error) {
    logError(error)
    throw new Error()
  }
}

export const serviceGetProfile = async (
  userId: string,
): Promise<Profile | null> => {
  try {
    const { profile }: InternalGetProfile =
      await internalGetProfile(userId)

    return profile
  } catch (error) {
    logError(error)
    throw new Error()
  }
}
