'use server'

import { createApiAxios } from '@/_gateway/api/_config/axios'
import { ITEM_ENDPOINTS } from '../_config/endpoints'
import { cleanPayload } from '@/lib/common/utils'
import { Item } from '@/lib/interfaces/item'

const apiItemAxios = await createApiAxios('/api/items')

export interface GetItemsRequest {
  page: number
  limit?: number
  keyword?: string | null
  sortBy?: string | null
  sortOrder?: string | null
  excludeUser?: string | null
}

export const _getItems = async (
  request: GetItemsRequest,
): Promise<{
  items: Item[]
  count: number
}> => {
  try {
    const response = await apiItemAxios.get(
      ITEM_ENDPOINTS.GET_ITEMS,
      {
        params: {
          ...cleanPayload(request),
        },
      },
    )

    return response.data
  } catch (error) {
    throw error
  }
}

export interface CreateItemRequest {
  name: string
  description: string
  price: number
  category: string
  condition: string
  postcode: string
}

export const _createItem = async (
  userId: string,
  request: CreateItemRequest,
): Promise<{ item: Item }> => {
  try {
    const response = await apiItemAxios.post(
      ITEM_ENDPOINTS.CREATE_ITEM(userId),
      cleanPayload(request),
    )

    const { item } = response.data

    if (!item) throw new Error('Item missing')

    return response.data
  } catch (error) {
    throw error
  }
}

export interface UpdateItemRequest {
  name?: string
  description?: string
  price?: number
  category?: string
  condition?: string
  postcode?: string
}

export const _updateItem = async (
  itemId: number,
  request: UpdateItemRequest,
): Promise<{ item: Item }> => {
  try {
    const response = await apiItemAxios.patch(
      ITEM_ENDPOINTS.UPDATE_ITEM(itemId),
      cleanPayload(request),
    )

    const { item } = response.data

    if (!item) throw new Error('Item missing')

    return response.data
  } catch (error) {
    throw error
  }
}

export const _uploadItems = async (
  itemId: number,
  images: File[],
): Promise<{ item: Item }> => {
  try {
    const formData = new FormData()
    images.forEach((image) =>
      formData.append('images', image),
    )

    const response = await apiItemAxios.post(
      ITEM_ENDPOINTS.UPLOAD_IMAGES(itemId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    const { item } = response.data

    if (!item) throw new Error('Item missing')

    return response.data
  } catch (error) {
    throw error
  }
}

export const _deleteItem = async (
  itemId: number,
): Promise<{ deleted: boolean }> => {
  try {
    const response = await apiItemAxios.delete(
      ITEM_ENDPOINTS.DELETE_ITEM(itemId),
    )

    return response.data
  } catch (error) {
    throw error
  }
}
