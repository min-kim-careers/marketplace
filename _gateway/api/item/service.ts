'use server'

import { getSessionUserId } from '@/_gateway/_common/helpers'
import { logApiError } from '@/_gateway/api/_config/helpers'
import {
  _deleteItem,
  _uploadItems,
  CreateItemRequest,
  GetItemsRequest,
} from './internal'
import { UpdateItemRequest } from './internal'
import {
  _createItem,
  _getItems,
  _updateItem,
} from '@/_gateway/api/item/internal'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { Item } from '@/lib/interfaces/item'
import { MarketParams } from '@/lib/interfaces/market-params'
import { ItemQueryMode } from '@/_gateway/api/_config/item-query.enum'
import { ListingsParams } from '@/lib/interfaces/listings-params'

const baseRequest = (
  params: MarketParams | ListingsParams,
) => ({
  page: params.page,
  keyword: params.keyword,
  sortBy: params.sortBy,
  sortOrder: params.sortOrder,
  limit: DEFAULT_ITEM_PAGINATION.LIMIT,
})

export const getItems = async (
  marketParams: MarketParams,
): Promise<{
  items: Item[]
  count: number
}> => {
  try {
    const userId = await getSessionUserId()

    const request: GetItemsRequest = {
      ...baseRequest(marketParams),
      userId,
      mode: userId
        ? ItemQueryMode.EXCLUDE_USER
        : ItemQueryMode.ALL,
    }

    const { items, count } = await _getItems(request)

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
      ...baseRequest(listingsParams),
      userId,
      mode: ItemQueryMode.ONLY_USER,
    }

    const { items, count } = await _getItems(request)

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

export const createItem = async (
  request: CreateItemRequest,
): Promise<Item | null> => {
  try {
    const userId = await getSessionUserId()
    if (!userId) throw new Error('Error creating item')

    const { item } = await _createItem(userId, request)

    return item
  } catch (error) {
    logApiError(error)
    return null
  }
}

export const updateItem = async (
  itemId: number,
  request: UpdateItemRequest,
): Promise<Item | null> => {
  try {
    const { item } = await _updateItem(itemId, request)

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
    const { item } = await _uploadItems(itemId, images)

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
    const { deleted } = await _deleteItem(itemId)

    return deleted
  } catch (error) {
    logApiError(error)
    return false
  }
}
