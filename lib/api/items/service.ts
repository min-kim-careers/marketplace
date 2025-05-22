'use server'

import itemsApi from '@/lib/api/items'
import {
  GetItemsResponse,
  GetSortOptionsResponse,
} from '@/lib/api/items/responses'
import { ItemsQuery } from '@/lib/interfaces/items'

export const getItems = async (
  query: ItemsQuery,
): Promise<GetItemsResponse> => {
  return itemsApi
    .get('', {
      params: query,
    })
    .then((response) => response.data as GetItemsResponse)
    .catch(() => {
      console.error('Server error')
      throw new Error()
    })
}

export const getSortOptions =
  async (): Promise<GetSortOptionsResponse> => {
    return itemsApi
      .get('/sort-options')
      .then(
        (response) =>
          response.data as GetSortOptionsResponse,
      )
      .catch(() => {
        console.error('Server error')
        throw new Error()
      })
  }

export const insertItem = async () => {
  return null
}
