'use server'

import { logApiError } from '@/_gateway/api/_config/helpers'
import { UpsertProfileRequest } from '@/_gateway/api/profile/_interfaces/upsert-profile.request'
import { getCurrentUserId } from '@/_gateway/_common/helpers'
import {
  internalHandleExists,
  internalGetProfile,
  internalUpsertProfile,
} from '@/_gateway/api/profile/internal'
import { Profile } from '@/lib/interfaces/profile'

export const serviceUpdateCurrentProfile = async (
  newProfile: UpsertProfileRequest,
): Promise<Profile | null> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId)
      throw new Error('Error updating current profile')

    const { profile } = await internalUpsertProfile(
      userId,
      newProfile,
    )

    return profile
  } catch (error) {
    logApiError(error)
    return null
  }
}

export const serviceGetCurrentProfile =
  async (): Promise<Profile | null> => {
    try {
      const userId = await getCurrentUserId()
      if (!userId)
        throw new Error('Error fetching current profile')

      const { profile } = await internalGetProfile(userId)

      return profile
    } catch (error) {
      logApiError(error)
      return null
    }
  }

export const serviceCheckHandleExists = async (
  handle: string,
): Promise<boolean> => {
  try {
    const { exists } = await internalHandleExists(handle)

    return exists
  } catch (error) {
    logApiError(error)
    throw new Error('Failed to check if handle exists')
  }
}
