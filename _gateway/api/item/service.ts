'use server'

import { getSessionUserId } from '@/_gateway/_common/helpers'
import { logApiError } from '@/_gateway/api/_config/helpers'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { Item } from '@/lib/interfaces/item'
import { MarketParams } from '@/lib/interfaces/market-params'
import { ITEM_ENDPOINTS } from '@/_gateway/api/item/endpoints'

export interface GetItemsRequest {
  page: number
  limit?: number
  keyword?: string
  sortBy?: string
  sortOrder?: string
}

export const getItems = async (
  marketParams: MarketParams,
): Promise<{
  items: Item[]
  count: number
}> => {
  try {
    const request: GetItemsRequest = {
      page: marketParams.page,
      keyword: marketParams.keyword,
      sortBy: marketParams.sortBy,
      sortOrder: marketParams.sortOrder,
      limit: DEFAULT_ITEM_PAGINATION.LIMIT,
    }

    const userId = await getSessionUserId()
    let res
    if (userId) {
      res = await ITEM_ENDPOINTS.GET_USER_ITEMS(
        userId,
        request,
      )
    } else {
      res = await ITEM_ENDPOINTS.GET_ITEMS(request)
    }

    const { items, count } = res

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

export interface CreateItemRequest {
  name: string
  description: string
  price: number
  category: string
  condition: string
  postcode: string
}

export const createItem = async (
  request: CreateItemRequest,
): Promise<Item | null> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error()

    const { item } = await ITEM_ENDPOINTS.CREATE_USER_ITEM(
      userId,
      request,
    )

    return item
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

export const updateItem = async (
  itemId: number,
  request: UpdateItemRequest,
): Promise<Item | null> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error()

    const { item } = await ITEM_ENDPOINTS.UPDATE_USER_ITEM(
      userId,
      itemId,
      request,
    )

    return item
  } catch (error) {
    logApiError(error)
    return null
  }
}

export const uploadImages = async (
  itemId: number,
  images: File[],
): Promise<Item | null> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error()

    const formData = new FormData()
    images.forEach((image) =>
      formData.append('images', image),
    )

    const { item } =
      await ITEM_ENDPOINTS.UPLOAD_USER_ITEM_IMAGES(
        userId,
        itemId,
        formData,
      )

    return item
  } catch (error) {
    logApiError(error)
    return null
  }
}

export const deleteItem = async (
  itemId: number,
): Promise<boolean> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error()

    const { deleted } =
      await ITEM_ENDPOINTS.DELETE_USER_ITEM(userId, itemId)

    return deleted
  } catch (error) {
    logApiError(error)
    return false
  }
}
