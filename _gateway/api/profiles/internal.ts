'use server'

import { apiAxios } from '@/_gateway/api/_config/axios'
import { PROFILES_ENDPOINTS } from '@/_gateway/api/_config/endpoints'
import { Profile } from '@/lib/interfaces/profiles'

export interface InternalUpsertProfile {
  profile: Profile
}

export const internalUpsertProfile = async (
  userId: string,
  email: string,
  handle?: string,
): Promise<InternalUpsertProfile> => {
  try {
    const response = await apiAxios.patch(
      PROFILES_ENDPOINTS.PATCH_PROFILE(userId),
      { email, handle },
    )

    const { profile }: InternalUpsertProfile = response.data

    if (!profile) throw new Error('Profile missing')

    return response.data as InternalUpsertProfile
  } catch (error) {
    throw error
  }
}

export interface InternalGetProfile {
  profile: Profile
}

export const internalGetProfile = async (
  userId: string,
): Promise<InternalGetProfile> => {
  try {
    const response = await apiAxios.get(
      PROFILES_ENDPOINTS.GET_PROFILE(userId),
    )

    const { profile }: InternalGetProfile = response.data

    if (!profile) throw new Error('Profile missing')

    return response.data as InternalGetProfile
  } catch (error) {
    throw error
  }
}
