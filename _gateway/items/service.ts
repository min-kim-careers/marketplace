'use server'

import {
  serverGetItems,
  serverGetSortOptions,
} from '@/_gateway/items/internal/transport'
import {
  GetItemsClientResponse,
  GetSortOptionsClientResponse,
} from '@/_gateway/items/responses'
import { ItemsQuery } from '@/lib/interfaces/items'

export const gatewayGetItems = async (
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
    console.error(error)
    return {
      success: false,
      items: [],
      count: 0,
    } as GetItemsClientResponse
  }
}

export const gatewayGetSortOptions =
  async (): Promise<GetSortOptionsClientResponse> => {
    try {
      const res = await serverGetSortOptions()

      return {
        success: true,
        sortOptions: res.sortOptions,
      } as GetSortOptionsClientResponse
    } catch (error) {
      console.error(error)
      return {
        success: false,
        sortOptions: [],
      } as GetSortOptionsClientResponse
    }
  }
