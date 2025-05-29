'use server'

import { logError } from '@/_gateway/_common/helpers'
import {
  internalGetProfile,
  internalUpsertProfile,
} from '@/_gateway/api/profiles/internal'
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
    const res = await internalUpsertProfile(userId, {
      email,
      handle,
    })

    return {
      success: true,
      profile: res.profile,
    } as CreateProfileServiceResponse
  } catch (error) {
    logError(error)
    return {
      success: false,
    } as CreateProfileServiceResponse
  }
}

export const serviceGetProfile = async (
  userId: string,
): Promise<GetProfileServiceResponse> => {
  try {
    const res = await internalGetProfile(userId)

    return {
      success: true,
      profile: res.profile,
    } as GetProfileServiceResponse
  } catch (error) {
    logError(error)
    return {
      success: false,
    } as GetProfileServiceResponse
  }
}
