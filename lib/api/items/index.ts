'use server'

import { createApi } from '@/lib/api/_common/config'
import { ApiResponse } from '@/lib/api/_common/responses'
import { GetItemsResponse } from '@/lib/api/items/responses'
import { ENDPOINTS } from '@/lib/constants/endpoints'
import { ItemsQuery } from '@/lib/interfaces/items'

const itemsApi = createApi(ENDPOINTS.ITEMS)

export const getItems = async (
  query: ItemsQuery,
): Promise<GetItemsResponse> => {
  console.log(itemsApi.defaults.baseURL)

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
