'use server'

import { apiAxios } from '@/_gateway/api/_config/axios'
import { ITEMS_ENDPOINTS } from '@/_gateway/api/_config/endpoints'
import { cleanPayload } from '@/lib/common'
import {
  Item,
  ItemsQuery,
  SortOption,
} from '@/lib/interfaces/items'

export interface InternalGetItems {
  items: Item[]
  count: number
}

export const internalGetItems = async (
  query: ItemsQuery,
): Promise<InternalGetItems> => {
  try {
    const response = await apiAxios.get(
      ITEMS_ENDPOINTS.GET_ITEMS,
      {
        params: cleanPayload(query),
      },
    )

    // const { items, count }: InternalGetItems =
    //   response.data

    // if (!items) throw new Error('Items missing')
    // if (!count) throw new Error('Count missing')

    return response.data as InternalGetItems
  } catch (error) {
    throw error
  }
}

export interface InternalGetSortOptions {
  sortOptions: SortOption[]
}

export const internalGetSortOptions =
  async (): Promise<InternalGetSortOptions> => {
    try {
      const response = await apiAxios.get(
        ITEMS_ENDPOINTS.GET_SORT_OPTIONS,
      )

      // const {
      //   sortOptions,
      // }: InternalGetSortOptions = response.data

      // if (!sortOptions) {
      //   throw new Error('Sort options missing')
      // }

      return response.data as InternalGetSortOptions
    } catch (error) {
      throw error
    }
  }
