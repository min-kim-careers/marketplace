'use server'

import {
  _UpdateConstraint,
  _UpdateConstraints,
  _UpsertProfileRequest,
  _getProfile,
  _getProfileExtra,
  _profileEmailExists,
  _profileHandleExists,
  _upsertProfile,
} from '@/api/endpoints'

export const getProfile = async () => {
  try {
    const { profile } = await _getProfile()
    return profile
  } catch (error) {
    console.error(error)
  }
}

export const profileHandleExists = async (handle: string) => {
  try {
    const { exists } = await _profileHandleExists(handle)
    return exists
  } catch (error) {
    console.error(error)
    return true
  }
}

export const profileEmailExists = async (email: string) => {
  try {
    const { exists } = await _profileEmailExists(email)
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

export type UpdateConstraint = _UpdateConstraint
export type UpdateConstraints = _UpdateConstraints
export const getProfileDashboardConstraints = async () => {
  try {
    const { extra } = await _getProfileExtra()
    const { updateConstraints } = extra
    return updateConstraints
  } catch (error) {
    console.error(error)
  }
}
