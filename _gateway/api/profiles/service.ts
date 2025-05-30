'use server'

import { logError } from '@/_gateway/_common/helpers'
import {
  internalGetProfile,
  internalUpsertProfile,
} from '@/_gateway/api/profiles/internal'
import {
  GetProfileInternalResponse,
  UpsertProfileInternalResponse,
} from '@/_gateway/api/profiles/internal/responses'
import {
  CreateProfileServiceResponse,
  GetProfileServiceResponse,
} from '@/_gateway/api/profiles/responses'

export const serviceCreateProfile = async (
  userId: string,
  email: string,
  handle: string,
): Promise<CreateProfileServiceResponse> => {
  try {
    const res: UpsertProfileInternalResponse =
      await internalUpsertProfile(userId, {
        email,
        handle,
      })

    return {
      profile: res.profile,
    } as CreateProfileServiceResponse
  } catch (error) {
    logError(error)
    return { profile: null } as CreateProfileServiceResponse
  }
}

export const serviceGetProfile = async (
  userId: string,
): Promise<GetProfileServiceResponse> => {
  try {
    const res: GetProfileInternalResponse =
      await internalGetProfile(userId)

    return {
      profile: res.profile,
    } as GetProfileServiceResponse
  } catch (error) {
    logError(error)
    return { profile: null } as GetProfileServiceResponse
  }
}
