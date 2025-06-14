'use server'

import { logApiError } from '@/_gateway/api/_config/helpers'
import { UpsertProfileRequest } from './internal'
import { getSessionUserId } from '@/_gateway/_common/helpers'
import {
  _handleExists,
  _getProfile,
  _upsertProfile,
  _getProfileExtra,
} from '@/_gateway/api/profile/internal'
import { Profile } from '@/lib/interfaces/profile'
import { ProfileExtra } from './internal'
import { _getListings } from './internal'
import { Item } from '@/lib/interfaces/item'

export const updateCurrentProfile = async (
  newProfile: UpsertProfileRequest,
): Promise<Profile | null> => {
  try {
    const userId = await getSessionUserId()
    if (!userId)
      throw new Error('Error updating current profile')

    const { profile } = await _upsertProfile(
      userId,
      newProfile,
    )

    return profile
  } catch (error) {
    logApiError(error)
    return null
  }
}

export const getCurrentProfile =
  async (): Promise<Profile | null> => {
    try {
      const userId = await getSessionUserId()
      if (!userId)
        throw new Error('Error fetching current profile')

      const { profile } = await _getProfile(userId)

      return profile
    } catch (error) {
      logApiError(error)
      return null
    }
  }

export const checkHandleExists = async (
  handle: string,
): Promise<boolean> => {
  try {
    const { exists } = await _handleExists(handle)

    return exists
  } catch (error) {
    logApiError(error)
    throw new Error('Failed to check if handle exists')
  }
}

export const getImageLimit = async (): Promise<number> => {
  try {
    const userId = await getSessionUserId()
    if (!userId)
      throw new Error('Error fetching profile extra')

    const { extra } = await _getProfileExtra(userId)

    return (extra as ProfileExtra).imageLimit
  } catch (error) {
    logApiError(error)
    throw new Error('Failed to get allowed images')
  }
}

export const getListings = async (): Promise<Item[]> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error('Error getting listings')

    const { items } = await _getListings(userId)

    return items
  } catch (error) {
    logApiError(error)
    return []
  }
}
