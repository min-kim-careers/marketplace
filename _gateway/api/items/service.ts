'use server'

import {
  internalGetItems,
  internalGetSortOptions,
} from '@/_gateway/api/items/internal'
import {
  GetItemsServiceResponse,
  GetSortOptionsServiceResponse,
} from '@/_gateway/api/items/responses'
import { logError } from '@/_gateway/_common/helpers'
import { ItemsQuery } from '@/lib/interfaces/items'

export const serviceGetItems = async (
  query: ItemsQuery,
): Promise<GetItemsServiceResponse> => {
  try {
    const res = await internalGetItems(query)

    return {
      items: res.items,
      count: res.count,
    } as GetItemsServiceResponse
  } catch (error) {
    logError(error)
    return {
      items: [],
      count: 0,
    } as GetItemsServiceResponse
  }
}

export const serviceGetSortOptions =
  async (): Promise<GetSortOptionsServiceResponse> => {
    try {
      const res = await internalGetSortOptions()

      return {
        sortOptions: res.sortOptions,
      } as GetSortOptionsServiceResponse
    } catch (error) {
      logError(error)
      return {
        sortOptions: [],
      } as GetSortOptionsServiceResponse
    }
  }
