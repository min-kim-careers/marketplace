'use server'

import {
  ItemQuery as ItemsQuery,
  ItemsResponse,
} from '@/lib/interfaces/items'
import { createApi } from './_common'
import { ENDPOINTS } from '../constants/endpoints'

const itemsApi = createApi(ENDPOINTS.ITEMS)

export const fetchItems = async (
  query: ItemsQuery,
): Promise<ItemsResponse> => {
  return itemsApi
    .get('', {
      params: query,
    })
    .then((response) => response.data as ItemsResponse)
    .catch((error) => {
      console.error(error)
      throw error
    })
}

export const insertItem = async () => {
  return null
}
