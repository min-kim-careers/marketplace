'use server'

import { getCurrentUserId } from '../_config/helpers'
import { logApiError } from '@/_gateway/api/_config/helpers'
import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { Item } from '@/lib/interfaces/item'
import * as ITEM_ENDPOINTS from '@/_gateway/api/item/endpoints'
import { ItemPageParams } from '@/lib/interfaces/item-page-params'
import { ItemStatus } from '@/lib/enums/item-status'
import { toFormData } from "@/_gateway/_common/helpers"

export interface GetItemsRequest {
  page: number
  limit?: number
  keyword?: string
  sortBy?: string
  sortOrder?: string
  excludeUser?: string
}

export const GET_ITEMS = async (
  itemPageParams: ItemPageParams,
): Promise<{
  items: Item[]
  count: number
}> => {
  try {
    const userId = await getCurrentUserId()

    const request: GetItemsRequest = {
      page: itemPageParams.page,
      keyword: itemPageParams.keyword,
      sortBy: itemPageParams.sortBy,
      sortOrder: itemPageParams.sortOrder,
      limit: DEFAULT_ITEM_PAGINATION.LIMIT,
      excludeUser: userId ?? undefined,
    }

    const { items, count } = await ITEM_ENDPOINTS._GET_ALL_ITEMS(request)

    return {
      items,
      count,
    }
  } catch (error) {
    logApiError(error)
    return {
      items: [],
      count: 0,
    }
  }
}

export interface GetItemsRequest {
  page: number
  limit?: number
  keyword?: string
  sortBy?: string
  sortOrder?: string
}

export const GET_USER_ITEMS = async (
  itemPageParams: ItemPageParams,
): Promise<{
  items: Item[]
  count: number
}> => {
  try {
    const request: GetItemsRequest = {
      page: itemPageParams.page,
      keyword: itemPageParams.keyword,
      sortBy: itemPageParams.sortBy,
      sortOrder: itemPageParams.sortOrder,
      limit: DEFAULT_ITEM_PAGINATION.LIMIT,
    }

    const userId = await getCurrentUserId()
    if (!userId) throw new Error()

    const { items, count } = await ITEM_ENDPOINTS._GET_USER_ITEMS(
      userId,
      request,
    )

    return {
      items,
      count,
    }
  } catch (error) {
    logApiError(error)
    return {
      items: [],
      count: 0,
    }
  }
}

export const GET_USER_ITEM = async (
  itemSlug: string,
): Promise<Item | null> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error()

    const { item } = await ITEM_ENDPOINTS._GET_USER_ITEM(userId, itemSlug)

    return item
  } catch (error) {
    logApiError(error)
    return null
  }
}

export interface UpsertItemRequest {
  name?: string
  description?: string
  price?: number
  category?: string
  condition?: string
  status?: string
  postcode?: string
  state?: string
  suburb?: string
  imageUrls?: string[]
  uploadImages?: File[]
}

const insertImageUrlsPlaceholders = (imageUrls: string[]) => {
  let placeholder_index = 0
  imageUrls.map((url) => {
    return url.startsWith('blob:') ? `{{${placeholder_index++}}}` : url
  })
  return imageUrls
}

export const UPSERT_ITEM = async (
  request: UpsertItemRequest,
  itemSlug?: string,
): Promise<Item | null> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error()

    if (request.imageUrls)
      request.imageUrls = insertImageUrlsPlaceholders(request.imageUrls)

    const formData = await toFormData(request)

    const { item } = await ITEM_ENDPOINTS._UPSERT_USER_ITEM(
      userId,
      formData,
      itemSlug,
    )

    return item
  } catch (error) {
    logApiError(error)
    return null
  }
}

export const DELETE_ITEM = async (itemSlug: string): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error()

    await ITEM_ENDPOINTS._DELETE_USER_ITEM(userId, itemSlug)

    return true
  } catch (error) {
    logApiError(error)
    return false
  }
}

export const UPDATE_ITEM_STATUS = async (
  itemSlug: string,
  status: ItemStatus,
): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId()
    if (!userId) throw new Error()

    const formData = await toFormData({ status })

    await ITEM_ENDPOINTS._UPSERT_USER_ITEM(userId, formData, itemSlug)

    return true
  } catch (error) {
    logApiError(error)
    return false
  }
}
