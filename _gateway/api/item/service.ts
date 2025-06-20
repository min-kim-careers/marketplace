'use server'

import { getSessionUserId } from '@/_gateway/_common/helpers'
import { logApiError } from '@/_gateway/api/_config/helpers'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { Item } from '@/lib/interfaces/item'
import * as ITEM_ENDPOINTS from '@/_gateway/api/item/endpoints'
import { ItemPageParams } from '@/lib/interfaces/item-page-params'

export interface GetItemsRequest {
  page: number
  limit?: number
  keyword?: string
  sortBy?: string
  sortOrder?: string
  excludeUser?: string
}

export const GET_ITEMS = async (
  itemPageParams: ItemPageParams,
): Promise<{
  items: Item[]
  count: number
}> => {
  try {
    const userId = await getSessionUserId()

    const request: GetItemsRequest = {
      page: itemPageParams.page,
      keyword: itemPageParams.keyword,
      sortBy: itemPageParams.sortBy,
      sortOrder: itemPageParams.sortOrder,
      limit: DEFAULT_ITEM_PAGINATION.LIMIT,
      excludeUser: userId ?? undefined,
    }

    const { items, count } =
      await ITEM_ENDPOINTS._GET_ALL_ITEMS(request)

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
  listingsParams: ItemPageParams,
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

export interface UpsertItemRequest {
  name?: string
  description?: string
  price?: number
  category?: string
  condition?: string
  status?: string
  postcode?: string
  state?: string
  suburb?: string
  imageUrls?: string[]
  uploadImages?: File[]
}

const requestToFormData = (request: UpsertItemRequest) => {
  const formData = new FormData()
  Object.entries(request).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v))
    } else {
      formData.append(key, value)
    }
  })
  return formData
}

export const UPSERT_ITEM = async (
  request: UpsertItemRequest,
  itemId?: string,
): Promise<Item | null> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error()

    if (request.imageUrls) {
      let placeholder_index = 0
      request.imageUrls = request.imageUrls.map((url) => {
        return url.startsWith('blob:')
          ? `{{${placeholder_index++}}}`
          : url
      })
    }

    const formData = requestToFormData(request)

    const { item } = await ITEM_ENDPOINTS._UPSERT_USER_ITEM(
      userId,
      formData,
      itemId,
    )

    return item
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
