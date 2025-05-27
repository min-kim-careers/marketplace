'use server'

import { apiAxios } from '@/_gateway/_common/_config/axios/api'
import { PROFILES_ENDPOINTS } from '@/_gateway/_common/_config/endpoints'
import { UpsertProfileServerPayload } from '@/_gateway/profiles/internal/requests'
import {
  GetProfileServerResponse,
  UpsertProfileServerResponse,
} from '@/_gateway/profiles/internal/responses'

export const serverUpsertProfile = async (
  userId: string,
  payload: UpsertProfileServerPayload,
): Promise<UpsertProfileServerResponse> => {
  try {
    const response = await apiAxios.put(
      PROFILES_ENDPOINTS.PUT_PROFILE(userId),
      payload,
    )

    const { profile }: UpsertProfileServerResponse =
      response.data

    if (!profile) throw new Error('Profile missing')

    return response.data as UpsertProfileServerResponse
  } catch (error) {
    console.error(error)
    throw new Error('Server Upsert profile failed')
  }
}

export const serverGetProfile = async (
  userId: string,
): Promise<GetProfileServerResponse> => {
  try {
    const response = await apiAxios.get(
      PROFILES_ENDPOINTS.GET_PROFILE(userId),
    )

    const { profile }: GetProfileServerResponse =
      response.data

    if (!profile) throw new Error('Profile missing')

    return response.data as GetProfileServerResponse
  } catch (error) {
    console.error(error)
    throw new Error('Server Get Profile failed')
  }
}
