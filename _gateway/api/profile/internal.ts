'use server'

import { apiAxios } from '@/_gateway/api/_config/axios'
import { PROFILE_ENDPOINTS } from './endpoints'
import { UpsertProfileRequest } from './_interfaces/upsert-profile.request'
import {
  cleanParam,
  cleanPayload,
} from '@/lib/common/utils'
import { Profile } from '@/lib/interfaces/profile'
import { AxiosError } from 'axios'

export const internalGetProfile = async (
  userId: string,
): Promise<{ profile: Profile | null }> => {
  try {
    const response = await apiAxios.get(
      PROFILE_ENDPOINTS.GET_PROFILE(cleanParam(userId)),
    )

    const { profile } = response.data

    if (!profile) throw new Error('Profile missing')

    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.status === 404)
      return { profile: null }

    throw error
  }
}

export const internalUpsertProfile = async (
  userId: string,
  request: UpsertProfileRequest,
): Promise<{
  profile: Profile
}> => {
  try {
    const response = await apiAxios.put(
      PROFILE_ENDPOINTS.UPSERT_PROFILE(userId),
      cleanPayload(request),
    )

    const { profile } = response.data

    if (!profile) throw new Error('Profile missing')

    return response.data
  } catch (error) {
    throw error
  }
}

export const internalHandleExists = async (
  handle: string,
): Promise<{
  exists: boolean
}> => {
  try {
    const response = await apiAxios.get(
      PROFILE_ENDPOINTS.CHECK_HANDLE_EXISTS(
        cleanParam(handle),
      ),
    )

    return response.data
  } catch (error) {
    throw error
  }
}
