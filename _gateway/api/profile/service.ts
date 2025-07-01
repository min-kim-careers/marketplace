'use server'

import { getCurrentUserId } from '../_config/helpers'
import { logApiError } from '@/_gateway/api/_config/helpers'
import * as PROFILE_ENDPOINTS from '@/_gateway/api/profile/endpoints'
import { IProfileExtra } from '@/_gateway/api/profile/interfaces'
import { IProfile } from '@/lib/interfaces/profile'

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
): Promise<IProfile | null> => {
  try {
    const userId = await getCurrentUserId()
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

// export const GET_PROFILE =
//   async (): Promise<IProfile | null> => {
//     try {
//       const userId = await getCurrentUserId()
//       if (!userId) throw new Error()

//       const { profile } =
//         await PROFILE_ENDPOINTS._GET_PROFILE(userId)

//       return profile
//     } catch (error) {
//       logApiError(error)
//       return null
//     }
//   }

export const HANDLE_EXISTS = async (
  handle: string,
): Promise<boolean> => {
  try {
    const { exists } =
      await PROFILE_ENDPOINTS._EXISTS_BY_HANDLE(handle)

    return exists
  } catch (error) {
    logApiError(error)
    throw new Error()
  }
}

export const GET_USER_ID_BY_HANDLE = async (
  handle: string,
): Promise<string | null> => {
  try {
    const { userId } =
      await PROFILE_ENDPOINTS._GET_USER_ID_BY_HANDLE(handle)

    return userId
  } catch (error) {
    logApiError(error)
    return null
  }
}

export const GET_PROFILE_EXTRA =
  async (): Promise<IProfileExtra | null> => {
    try {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error()

      const { extra } =
        await PROFILE_ENDPOINTS._GET_PROFILE_EXTRA(userId)

      return extra as IProfileExtra
    } catch (error) {
      logApiError(error)
      return null
    }
  }
