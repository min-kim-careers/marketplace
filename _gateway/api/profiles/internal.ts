'use server'

import { apiAxios } from '@/_gateway/api/_config/axios'
import { PROFILES_ENDPOINTS } from '@/_gateway/api/_config/endpoints'
import { UpsertProfileRequest } from '@/_gateway/_common/_models/upsert-profile.request'
import { Profile } from '@/lib/interfaces/profiles'
import { AxiosError } from 'axios'

export interface InternalUpsertProfile {
  profile: Profile
}

export const internalUpsertProfile = async (
  userId: string,
  request: UpsertProfileRequest,
): Promise<InternalUpsertProfile> => {
  try {
    const response = await apiAxios.patch(
      PROFILES_ENDPOINTS.PATCH_PROFILE(userId),
      request,
    )

    const { profile }: InternalUpsertProfile = response.data

    if (!profile) throw new Error('Profile missing')

    return response.data as InternalUpsertProfile
  } catch (error) {
    throw error
  }
}

export interface InternalGetProfile {
  profile: Profile | null
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
    if (error instanceof AxiosError && error.status === 404)
      return { profile: null }

    throw error
  }
}

export interface InternalGetHandleExists {
  exists: boolean
}

export const internalGetHandleExists = async (
  handle: string,
) => {
  try {
    const response = await apiAxios.get(
      PROFILES_ENDPOINTS.GET_HANDLE_EXISTS(handle),
    )

    return response.data as InternalGetHandleExists
  } catch (error) {
    throw error
  }
}
