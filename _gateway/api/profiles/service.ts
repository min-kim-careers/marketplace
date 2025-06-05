'use server'

import { UpsertProfileRequest } from '@/_gateway/_common/_models/upsert-profile.request'
import {
  getCurrentUserId,
  logError,
} from '@/_gateway/_common/helpers'
import {
  internalGetHandleExists,
  InternalGetProfile,
  internalGetProfile,
  internalUpsertProfile,
  InternalUpsertProfile,
} from '@/_gateway/api/profiles/internal'
import { Profile } from '@/lib/interfaces/profiles'

export const serviceUpdateCurrentProfile = async (
  request: UpsertProfileRequest,
): Promise<Profile | null> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Unable to get user ID')

    const { profile }: InternalUpsertProfile =
      await internalUpsertProfile(userId, request)

    return profile
  } catch (error) {
    logError(error)
    return null
  }
}

export const serviceGetCurrentProfile =
  async (): Promise<Profile | null> => {
    try {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('Unable to get user ID')

      const { profile }: InternalGetProfile =
        await internalGetProfile(userId)

      return profile
    } catch (error) {
      logError(error)
      return null
    }
  }

export const serviceCheckHandleExists = async (
  handle: string,
): Promise<boolean> => {
  try {
    const { exists } = await internalGetHandleExists(handle)

    return exists
  } catch (error) {
    logError(error)
    throw new Error('Failed to check if handle exists')
  }
}
