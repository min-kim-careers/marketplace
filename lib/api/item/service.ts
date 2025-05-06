'use server'

import itemsApi from '.'
import { APIQuery } from '../../interfaces/items/params'
import { ItemResponse } from '../../interfaces/items/response'

export const fetchItems = async (
  query: APIQuery,
): Promise<ItemResponse> => {
  return itemsApi
    .get('/get', {
      params: query,
    })
    .then((response) => response.data as ItemResponse)
    .catch((error) => {
      throw Error()
    })
}

export const insertItem = async () => {
  return null
}
