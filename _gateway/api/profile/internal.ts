'use server'

import { createApiAxios } from '@/_gateway/api/_config/axios'
import { GetItemsRequest } from '../item/interfaces'
import { Item } from '@/lib/interfaces/item'
import { ItemListing } from '@/lib/interfaces/item-listing'
import { Profile } from '@/lib/interfaces/profile'
import { AxiosError } from 'axios'
import { PROFILE_ENDPOINTS } from '../_config/endpoints'
import {
  ProfileExtra,
  UpsertProfileRequest,
} from '@/_gateway/api/profile/interfaces'

const apiProfileAxios =
  await createApiAxios('/api/profiles')

export const _getProfile = async (
  userId: string,
): Promise<{ profile: Profile | null }> => {
  try {
    const response = await apiProfileAxios.get(
      PROFILE_ENDPOINTS.GET_PROFILE(userId),
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

export const _upsertProfile = async (
  userId: string,
  request: UpsertProfileRequest,
): Promise<{
  profile: Profile
}> => {
  try {
    const response = await apiProfileAxios.put(
      PROFILE_ENDPOINTS.UPSERT_PROFILE(userId),
      request,
    )

    const { profile } = response.data

    if (!profile) throw new Error('Profile missing')

    return response.data
  } catch (error) {
    throw error
  }
}

export const _handleExists = async (
  handle: string,
): Promise<{
  exists: boolean
}> => {
  try {
    const response = await apiProfileAxios.get(
      PROFILE_ENDPOINTS.CHECK_HANDLE_EXISTS(handle),
    )

    return response.data
  } catch (error) {
    throw error
  }
}

export const _getProfileExtra = async (
  userId: string,
): Promise<{ extra: ProfileExtra }> => {
  try {
    const response = await apiProfileAxios.get(
      PROFILE_ENDPOINTS.GET_PROFILE_EXTRA(userId),
    )

    return response.data
  } catch (error) {
    throw error
  }
}

export const _getListings = async (
  userId: string,
): Promise<{ listings: ItemListing[] }> => {
  try {
    const response = await apiProfileAxios.get(
      PROFILE_ENDPOINTS.GET_LISTINGS(userId),
    )

    return response.data
  } catch (error) {
    throw error
  }
}

export const _getUserItems = async (
  request: GetItemsRequest,
  userId: string,
): Promise<{
  items: Item[]
  count: number
}> => {
  try {
    const response = await apiProfileAxios.get(
      PROFILE_ENDPOINTS.GET_USER_ITEMS(userId),
      {
        params: request,
      },
    )

    return response.data
  } catch (error) {
    throw error
  }
}
