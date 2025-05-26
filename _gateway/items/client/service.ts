'use server'

import {
  GetItemsClientResponse,
  GetSortOptionsClientResponse,
} from '@/_gateway/items/client/responses'
import {
  serverGetItems,
  serverGetSortOptions,
} from '@/_gateway/items/server/service'
import { ItemsQuery } from '@/lib/interfaces/items'

export const clientGetItems = async (
  query: ItemsQuery,
): Promise<GetItemsClientResponse> => {
  try {
    const res = await serverGetItems(query)

    return {
      success: true,
      items: res.items,
      count: res.count,
    } as GetItemsClientResponse
  } catch (error) {
    console.error('Items Get Items Error:', error)
    return {
      success: false,
      items: [],
      count: 0,
    } as GetItemsClientResponse
  }
}

export const clientGetSortOptions =
  async (): Promise<GetSortOptionsClientResponse> => {
    try {
      const res = await serverGetSortOptions()

      return {
        success: true,
        sortOptions: res.sortOptions,
      } as GetSortOptionsClientResponse
    } catch (error) {
      return {
        success: false,
        sortOptions: [],
      } as GetSortOptionsClientResponse
    }
  }
