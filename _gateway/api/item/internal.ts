'use server'

import { apiAxios } from '@/_gateway/api/_config/axios'
import { ITEM_ENDPOINTS } from '@/_gateway/api/item/endpoints'
import { cleanPayload } from '@/lib/common/utils'
import {
  Item,
  // ItemSortOption,
} from '@/lib/interfaces/item'
import { GetItemsRequest } from './_interfaces/get-items.request'
import { CreateItemRequest } from '@/_gateway/api/item/_interfaces/create-item.request'
import { UpdateItemRequest } from '@/_gateway/api/item/_interfaces/update-item.request'

export const internalGetItems = async (
  request: GetItemsRequest,
): Promise<{
  items: Item[]
  count: number
}> => {
  try {
    const response = await apiAxios.get(
      ITEM_ENDPOINTS.GET_ITEMS,
      {
        params: cleanPayload(request),
      },
    )

    return response.data
  } catch (error) {
    throw error
  }
}

export const internalCreateItem = async (
  userId: string,
  request: CreateItemRequest,
): Promise<{ item: Item }> => {
  try {
    const response = await apiAxios.post(
      ITEM_ENDPOINTS.CREATE_ITEMS(userId),
      cleanPayload(request),
    )

    const { item } = response.data

    if (!item) throw new Error('Item missing')

    return response.data
  } catch (error) {
    throw error
  }
}

export const internalUpdateItem = async (
  itemId: number,
  request: UpdateItemRequest,
): Promise<{ item: Item }> => {
  try {
    const response = await apiAxios.patch(
      ITEM_ENDPOINTS.UPDATE_ITEMS(itemId),
      cleanPayload(request),
    )

    const { item } = response.data

    if (!item) throw new Error('Item missing')

    return response.data
  } catch (error) {
    throw error
  }
}
