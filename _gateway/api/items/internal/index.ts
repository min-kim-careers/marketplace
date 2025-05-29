'use server'

import { apiAxios } from '@/_gateway/api/_config/axios'
import { ITEMS_ENDPOINTS } from '@/_gateway/api/_config/endpoints'
import {
  GetItemsInternalResponse,
  GetSortOptionsInternalResponse,
} from '@/_gateway/api/items/internal/responses'
import { ItemsQuery } from '@/lib/interfaces/items'

export const internalGetItems = async (
  query: ItemsQuery,
): Promise<GetItemsInternalResponse> => {
  try {
    const response = await apiAxios.get(
      ITEMS_ENDPOINTS.GET_ITEMS,
      {
        params: query,
      },
    )

    const { items, count }: GetItemsInternalResponse =
      response.data

    if (!items) throw new Error('Items missing')
    if (!count) throw new Error('Count missing')

    return response.data as GetItemsInternalResponse
  } catch (error) {
    throw error
  }
}

export const internalGetSortOptions =
  async (): Promise<GetSortOptionsInternalResponse> => {
    try {
      const response = await apiAxios.get(
        ITEMS_ENDPOINTS.GET_SORT_OPTIONS,
      )

      const {
        sortOptions,
      }: GetSortOptionsInternalResponse = response.data

      if (!sortOptions) {
        throw new Error('Sort options missing')
      }

      return response.data as GetSortOptionsInternalResponse
    } catch (error) {
      throw error
    }
  }
