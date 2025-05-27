'use server'

import { apiAxios } from "@/_gateway/_common/_config/axios/api"
import { ITEMS_ENDPOINTS } from "@/_gateway/_common/_config/endpoints"
import {
  GetItemsServerResponse,
  GetSortOptionsServerResponse,
} from '@/_gateway/items/internal/responses'
import { ItemsQuery } from '@/lib/interfaces/items'

export const serverGetItems = async (
  query: ItemsQuery,
): Promise<GetItemsServerResponse> => {
  try {
    const response = await apiAxios.get(
      ITEMS_ENDPOINTS.GET_ITEMS,
      {
        params: query,
      },
    )

    const { items, count }: GetItemsServerResponse =
      response.data

    if (!items) throw new Error('Items missing')
    if (!count) throw new Error('Count missing')

    return response.data as GetItemsServerResponse
  } catch (error) {
    console.error(error)
    throw new Error('Server Get Items failed')
  }
}

export const serverGetSortOptions =
  async (): Promise<GetSortOptionsServerResponse> => {
    try {
      const response = await apiAxios.get(
        ITEMS_ENDPOINTS.GET_SORT_OPTIONS,
      )

      const { sortOptions }: GetSortOptionsServerResponse =
        response.data

      if (!sortOptions) throw new Error('Sort options missing')

      return response.data as GetSortOptionsServerResponse
    } catch (error) {
      console.error(error)
      throw new Error('Server Get Sort Options failed')
    }
  }
