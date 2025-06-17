'use server'

import { getSessionUserId } from '@/_gateway/_common/helpers'
import { logApiError } from '@/_gateway/api/_config/helpers'
import { GetItemsRequest } from '../item/interfaces'
import { _getUserItems } from './internal'
import {
  _getProfile,
  _getProfileExtra,
  _handleExists,
  _upsertProfile,
} from '@/_gateway/api/profile/internal'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { Item } from '@/lib/interfaces/item'
import { ItemListing } from '@/lib/interfaces/item-listing'
import { ListingsParams } from '@/lib/interfaces/listings-params'
import { Profile } from '@/lib/interfaces/profile'
import { _getListings } from './internal'
import { ProfileExtra } from './interfaces'
import { UpsertProfileRequest } from './interfaces'

export const updateCurrentProfile = async (
  newProfile: UpsertProfileRequest,
): Promise<Profile | null> => {
  try {
    const userId = await getSessionUserId()
    if (!userId)
      throw new Error('Error updating current profile')

    const { profile } = await _upsertProfile(
      userId,
      newProfile,
    )

    return profile
  } catch (error) {
    logApiError(error)
    return null
  }
}

export const getCurrentProfile =
  async (): Promise<Profile | null> => {
    try {
      const userId = await getSessionUserId()
      if (!userId)
        throw new Error('Error fetching current profile')

      const { profile } = await _getProfile(userId)

      return profile
    } catch (error) {
      logApiError(error)
      return null
    }
  }

export const checkHandleExists = async (
  handle: string,
): Promise<boolean> => {
  try {
    const { exists } = await _handleExists(handle)

    return exists
  } catch (error) {
    logApiError(error)
    throw new Error('Failed to check if handle exists')
  }
}

export const getProfileExtra =
  async (): Promise<ProfileExtra | null> => {
    try {
      const userId = await getSessionUserId()
      if (!userId)
        throw new Error('Error fetching profile extra')

      const { extra } = await _getProfileExtra(userId)

      return extra as ProfileExtra
    } catch (error) {
      logApiError(error)
      return null
    }
  }

export const getListings = async (): Promise<
  ItemListing[]
> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error('Error getting listings')

    const { listings } = await _getListings(userId)

    return listings
  } catch (error) {
    logApiError(error)
    return []
  }
}

export const getUserItems = async (
  listingsParams: ListingsParams,
): Promise<{
  items: Item[]
  count: number
}> => {
  try {
    const userId = await getSessionUserId()
    if (!userId)
      throw new Error('Error fetching user items')

    const request: GetItemsRequest = {
      page: listingsParams.page,
      keyword: listingsParams.keyword,
      sortBy: listingsParams.sortBy,
      sortOrder: listingsParams.sortOrder,
      limit: DEFAULT_ITEM_PAGINATION.LIMIT,
    }

    const { items, count } = await _getUserItems(
      request,
      userId,
    )

    return {
      items,
      count,
    }
  } catch (error) {
    logApiError(error)
    return {
      items: [],
      count: 0,
    }
  }
}
