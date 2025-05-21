'use server'

import itemsApi from '@/lib/api/items'
import { GetItemsResponse } from '@/lib/api/items/responses'
import { ItemsQuery } from '@/lib/interfaces/items'

export const getItems = async (
  query: ItemsQuery,
): Promise<GetItemsResponse> => {
  return itemsApi
    .get('', {
      params: query,
    })
    .then((response) => response.data as GetItemsResponse)
    .catch((error) => {
      console.error('Server error')
      throw new Error()
    })
}

export const insertItem = async () => {
  return null
}
