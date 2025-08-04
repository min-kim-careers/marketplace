'use server'

import {
  _UpsertProfileRequest,
  _getProfileExtra,
  _profileHandleExists,
  _upsertProfile,
} from '@/api/endpoints'

export const profileHandleExists = async (handle: string) => {
  try {
    const { exists } = await _profileHandleExists(handle)
    return exists
  } catch (error) {
    console.error(error)
    return true
  }
}

export type UpsertProfileRequest = _UpsertProfileRequest
export const upsertProfile = async (request: UpsertProfileRequest) => {
  try {
    const res = await _upsertProfile(request)
    return res.profile
  } catch (error) {
    console.error(error)
  }
}

export const getItemImageLimit = async () => {
  try {
    const { extra } = await _getProfileExtra()
    return extra.imageLimit
  } catch (error) {
    console.error(error)
    return 0
  }
}

export const checkCanUpdateHandle = async () => {
  try {
    const { extra } = await _getProfileExtra()
    return extra.nextHandleUpdate < new Date()
  } catch (error) {
    console.error(error)
    return false
  }
}
