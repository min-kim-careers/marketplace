'use server'

import { getSessionUserId } from '@/_gateway/_common/helpers'
import { logApiError } from '@/_gateway/api/_config/helpers'
import * as PROFILE_ENDPOINTS from '@/_gateway/api/profile/endpoints'
import { ProfileExtra } from '@/_gateway/api/profile/interfaces'
import { Profile } from '@/lib/interfaces/profile'

export interface UpsertProfileRequest {
  email?: string
  handle?: string
  rating?: number
  ratingCount?: number
  postcode?: string
  suburb?: string
  state?: string
  avatarUrl?: string
}

export const UPDATE_PROFILE = async (
  newProfile: UpsertProfileRequest,
): Promise<Profile | null> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error()

    const { profile } =
      await PROFILE_ENDPOINTS._UPSERT_PROFILE(
        userId,
        newProfile,
      )

    return profile
  } catch (error) {
    logApiError(error)
    return null
  }
}

export const GET_PROFILE =
  async (): Promise<Profile | null> => {
    try {
      const userId = await getSessionUserId()
      if (!userId) throw new Error()

      const { profile } =
        await PROFILE_ENDPOINTS._GET_PROFILE(userId)

      return profile
    } catch (error) {
      logApiError(error)
      return null
    }
  }

export const HANDLE_EXISTS = async (
  handle: string,
): Promise<boolean> => {
  try {
    const { exists } =
      await PROFILE_ENDPOINTS._HANDLE_EXISTS(handle)

    return exists
  } catch (error) {
    logApiError(error)
    throw new Error('Error checking if handle exists')
  }
}

export const GET_PROFILE_EXTRA =
  async (): Promise<ProfileExtra | null> => {
    try {
      const userId = await getSessionUserId()
      if (!userId) throw new Error()

      const { extra } =
        await PROFILE_ENDPOINTS._GET_PROFILE_EXTRA(userId)

      return extra as ProfileExtra
    } catch (error) {
      logApiError(error)
      return null
    }
  }
