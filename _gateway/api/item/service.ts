'use server'

import { getSessionUserId } from '@/_gateway/_common/helpers'
import { logApiError } from '@/_gateway/api/_config/helpers'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { Item } from '@/lib/interfaces/item'
import { MarketParams } from '@/lib/interfaces/market-params'
import * as ITEM_ENDPOINTS from '@/_gateway/api/item/endpoints'
import { ListingsParams } from '@/lib/interfaces/listings-params'

export interface GetItemsRequest {
  page: number
  limit?: number
  keyword?: string
  sortBy?: string
  sortOrder?: string
  excludeUser?: string
}

export const GET_ITEMS = async (
  marketParams: MarketParams,
): Promise<{
  items: Item[]
  count: number
}> => {
  try {
    const userId = await getSessionUserId()

    const request: GetItemsRequest = {
      page: marketParams.page,
      keyword: marketParams.keyword,
      sortBy: marketParams.sortBy,
      sortOrder: marketParams.sortOrder,
      limit: DEFAULT_ITEM_PAGINATION.LIMIT,
      excludeUser: userId ?? undefined
    }

    const { items, count } = await ITEM_ENDPOINTS._GET_ALL_ITEMS(request)

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

export interface GetItemsRequest {
  page: number
  limit?: number
  keyword?: string
  sortBy?: string
  sortOrder?: string
}

export const GET_USER_ITEMS = async (
  listingsParams: ListingsParams,
): Promise<{
  items: Item[]
  count: number
}> => {
  try {
    const request: GetItemsRequest = {
      page: listingsParams.page,
      keyword: listingsParams.keyword,
      sortBy: listingsParams.sortBy,
      sortOrder: listingsParams.sortOrder,
      limit: DEFAULT_ITEM_PAGINATION.LIMIT,
    }

    const userId = await getSessionUserId()
    if (!userId) throw new Error()

    const { items, count } =
      await ITEM_ENDPOINTS._GET_USER_ITEMS(userId, request)

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

export const GET_USER_ITEM = async (
  itemId: string,
): Promise<Item | null> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error()

    const { item } = await ITEM_ENDPOINTS._GET_USER_ITEM(
      userId,
      itemId,
    )

    return item
  } catch (error) {
    logApiError(error)
    return null
  }
}

export interface CreateItemRequest {
  name: string
  description: string
  price: number
  category: string
  condition: string
  postcode: string
}

export const CREATE_ITEM = async (
  request: CreateItemRequest,
  images: File[],
): Promise<Item | null> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error()

    let newItem

    try {
      const { item } =
        await ITEM_ENDPOINTS._CREATE_USER_ITEM(
          userId,
          request,
        )
      newItem = item
    } catch (error) {
      throw error
    }

    const formData = new FormData()
    images.forEach((image) =>
      formData.append('images', image),
    )

    try {
      const { item } =
        await ITEM_ENDPOINTS._UPLOAD_USER_ITEM_IMAGES(
          userId,
          newItem.id,
          formData,
        )
      newItem = item
    } catch (error) {
      await ITEM_ENDPOINTS._DELETE_USER_ITEM(
        userId,
        newItem.id,
      )
      throw error
    }

    return newItem
  } catch (error) {
    logApiError(error)
    return null
  }
}

export interface UpdateItemRequest {
  name?: string
  description?: string
  price?: number
  category?: string
  condition?: string
  status?: string
  postcode?: string
}

export const UPDATE_ITEM = async (
  itemId: string,
  request: UpdateItemRequest,
  images: File[],
): Promise<Item | null> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error()

    let newItem

    try {
      const { item } =
        await ITEM_ENDPOINTS._UPDATE_USER_ITEM(
          userId,
          itemId,
          request,
        )
      newItem = item
    } catch (error) {
      throw error
    }

    const formData = new FormData()
    images.forEach((image) =>
      formData.append('images', image),
    )

    try {
      const { item } =
        await ITEM_ENDPOINTS._UPLOAD_USER_ITEM_IMAGES(
          userId,
          newItem.id,
          formData,
        )
      newItem = item
    } catch (error) {
      throw error
    }

    return newItem
  } catch (error) {
    logApiError(error)
    return null
  }
}

export const DELETE_ITEM = async (
  itemId: string,
): Promise<boolean> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error()

    const { deleted } =
      await ITEM_ENDPOINTS._DELETE_USER_ITEM(userId, itemId)

    return deleted
  } catch (error) {
    logApiError(error)
    return false
  }
}
