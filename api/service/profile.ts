'use server'

import {
  _UpsertProfileRequest,
  _getProfileExtra,
  _profileHandleExists,
  _upsertProfile,
} from '@/api/endpoints'

export const profileHandleExists = async (handle: string) =>
  _profileHandleExists(handle).then((r) => r.exists)

export type UpsertProfileRequest = _UpsertProfileRequest
export const upsertProfile = async (request: UpsertProfileRequest) => {
  try {
    const res = await _upsertProfile(request)
    return res.profile
  } catch (error) {
    console.error(error)
  }
}

export const getProfileExtra = async () =>
  _getProfileExtra().then((r) => r.extra)
