'use server'

import profilesApi from '@/_gateway/profiles/_config'
import { PROFILES_ENDPOINTS } from '@/_gateway/profiles/_common/endpoints'
import { UpsertProfileServerPayload } from '@/_gateway/profiles/server/requests'
import {
  GetProfileServerResponse,
  UpsertProfileServerResponse,
} from '@/_gateway/profiles/server/responses'

export const serverUpsertProfile = async (
  userId: string,
  email: string,
  handle: string,
): Promise<UpsertProfileServerResponse> => {
  const payload: UpsertProfileServerPayload = { email, handle }

  return await profilesApi
    .put(PROFILES_ENDPOINTS.PUT_PROFILE(userId), payload)
    .then(
      (response) =>
        response.data as UpsertProfileServerResponse,
    )
    .catch((error) => {
      throw error
    })
}

export const serverGetProfile = async (
  userId: string,
): Promise<GetProfileServerResponse> => {
  return await profilesApi
    .get(PROFILES_ENDPOINTS.GET_PROFILE(userId))
    .then(
      (response) =>
        response.data as GetProfileServerResponse,
    )
    .catch((error) => {
      throw error
    })
}
