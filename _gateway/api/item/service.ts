'use server'

import { getSessionUserId } from '@/_gateway/_common/helpers'
import { logApiError } from '@/_gateway/api/_config/helpers'
import {
  _createItem,
  _getItems,
  _updateItem,
} from '@/_gateway/api/item/internal'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { Item } from '@/lib/interfaces/item'
import { MarketParams } from '@/lib/interfaces/market-params'
import {
  _deleteItem,
  _uploadItems,
} from './internal'
import { UpdateItemRequest } from './interfaces'
import { CreateItemRequest } from './interfaces'
import { GetItemsRequest } from './interfaces'


export const getItems = async (
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
      excludeUser: userId ?? undefined,
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
