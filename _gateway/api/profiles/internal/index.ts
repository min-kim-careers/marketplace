'use server'

import { apiAxios } from '@/_gateway/api/_config/axios'
import { PROFILES_ENDPOINTS } from '@/_gateway/api/_config/endpoints'
import { UpsertProfileInternalPayload } from '@/_gateway/api/profiles/internal/requests'
import {
  GetProfileInternalResponse,
  UpsertProfileInternalResponse,
} from '@/_gateway/api/profiles/internal/responses'

export const internalUpsertProfile = async (
  userId: string,
  payload: UpsertProfileInternalPayload,
): Promise<UpsertProfileInternalResponse> => {
  try {
    const response = await apiAxios.put(
      PROFILES_ENDPOINTS.PUT_PROFILE(userId),
      payload,
    )

    const { profile }: UpsertProfileInternalResponse =
      response.data

    if (!profile) throw new Error('Profile missing')

    return response.data as UpsertProfileInternalResponse
  } catch (error) {
    throw error
  }
}

export const internalGetProfile = async (
  userId: string,
): Promise<GetProfileInternalResponse> => {
  try {
    const response = await apiAxios.get(
      PROFILES_ENDPOINTS.GET_PROFILE(userId),
    )

    const { profile }: GetProfileInternalResponse =
      response.data

    if (!profile) throw new Error('Profile missing')

    return response.data as GetProfileInternalResponse
  } catch (error) {
    throw error
  }
}
