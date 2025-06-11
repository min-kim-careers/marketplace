'use server'

import { getCurrentUserId } from '@/_gateway/_common/helpers'
import { logApiError } from '@/_gateway/api/_config/helpers'
import { CreateItemRequest } from '@/_gateway/api/item/_interfaces/create-item.request'
import { UpdateItemRequest } from '@/_gateway/api/item/_interfaces/update-item.request'
import {
  internalCreateItem,
  internalGetItems,
  internalUpdateItem,
} from '@/_gateway/api/item/internal'
import { ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { Item } from '@/lib/interfaces/item'
import { MarketParams } from '@/lib/interfaces/market-params'

export const serviceGetItems = async (
  marketParams: MarketParams,
): Promise<{
  items: Item[]
  count: number
}> => {
  try {
    const { items, count } = await internalGetItems({
      page: marketParams.page,
      keyword: marketParams.keyword,
      sortBy: marketParams.sortBy,
      sortOrder: marketParams.sortOrder,
      limit: ITEM_PAGINATION.LIMIT,
    })

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

export const serviceCreateItem = async (
  request: CreateItemRequest,
): Promise<Item | null> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error('Error creating item')

    const { item } = await internalCreateItem(
      userId,
      request,
    )

    return item
  } catch (error) {
    logApiError(error)
    return null
  }
}

export const serviceUpdateItem = async (
  itemId: number,
  request: UpdateItemRequest,
): Promise<Item | null> => {
  try {
    const { item } = await internalUpdateItem(
      itemId,
      request,
    )

    return item
  } catch (error) {
    logApiError(error)
    return null
  }
}
