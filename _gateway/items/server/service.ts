'use server'

import { ITEMS_ENDPOINTS } from '@/_gateway/items/_common/endpoints'
import itemsApi from '@/_gateway/items/_config'
import {
  GetItemsServerResponse,
  GetSortOptionsServerResponse,
} from '@/_gateway/items/server/responses'
import { ItemsQuery } from '@/lib/interfaces/items'

export const serverGetItems = async (
  query: ItemsQuery,
): Promise<GetItemsServerResponse> => {
  return itemsApi
    .get(ITEMS_ENDPOINTS.GET_ITEMS, {
      params: query,
    })
    .then(
      (response) => response.data as GetItemsServerResponse,
    )
    .catch((error) => {
      console.error('Items Get Items Error:', error)
      throw error
    })
}

export const serverGetSortOptions =
  async (): Promise<GetSortOptionsServerResponse> => {
    return itemsApi
      .get(ITEMS_ENDPOINTS.GET_SORT_OPTIONS)
      .then(
        (response) =>
          response.data as GetSortOptionsServerResponse,
      )
      .catch((error) => {
        console.error(
          'Items Get Sort Options Error:',
          error,
        )
        throw error
      })
  }
