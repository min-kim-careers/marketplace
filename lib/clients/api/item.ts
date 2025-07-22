'use server'

import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { Item } from '@/lib/interfaces/item'
import { ItemPageParams } from '@/lib/interfaces/item-page-params'
import { ItemStatus } from '@/lib/enums/item-status'
// import { toFormData } from '@gateway/src/helpers/to-form-data'
import {
  GetItemsRequest,
  UpsertItemRequest,
} from '@gateway/src/services/api/requests'

export const GET_ITEMS = async (
  itemPageParams: ItemPageParams,
): Promise<{
  items: Item[]
  count: number
}> => {
  return {
      items: [],
      count: 0,
    } 
  // try {
  //   const userId = await getCurrentUserId()

  //   const request: GetItemsRequest = {
  //     page: itemPageParams.page,
  //     keyword: itemPageParams.keyword,
  //     sortBy: itemPageParams.sortBy,
  //     sortOrder: itemPageParams.sortOrder,
  //     limit: DEFAULT_ITEM_PAGINATION.LIMIT,
  //     excludeUser: userId ?? undefined,
  //   }

  //   const { items, count } = await ITEM_ENDPOINTS._GET_ALL_ITEMS(request)

  //   return {
  //     items,
  //     count,
  //   }
  // } catch (error) {
  //   return {
  //     items: [],
  //     count: 0,
  //   }
  // }
}

export const GET_USER_ITEMS = async (
  itemPageParams: ItemPageParams,
): Promise<{
  items: Item[]
  count: number
}> => {
  return {
      items: [],
      count: 0,
    }
  // try {
  //   const request: GetItemsRequest = {
  //     page: itemPageParams.page,
  //     keyword: itemPageParams.keyword,
  //     sortBy: itemPageParams.sortBy,
  //     sortOrder: itemPageParams.sortOrder,
  //     limit: DEFAULT_ITEM_PAGINATION.LIMIT,
  //   }

  //   const userId = await getCurrentUserId()
  //   if (!userId) throw new Error()

  //   const { items, count } = await ITEM_ENDPOINTS._GET_USER_ITEMS(
  //     userId,
  //     request,
  //   )

  //   return {
  //     items,
  //     count,
  //   }
  // } catch (error) {
  //   return {
  //     items: [],
  //     count: 0,
  //   }
  // }
}

export const GET_USER_ITEM = async (itemSlug: string): Promise<Item | null> => {
  return null
  // try {
  //   const userId = await getCurrentUserId()
  //   if (!userId) throw new Error()

  //   const { item } = await ITEM_ENDPOINTS._GET_USER_ITEM(userId, itemSlug)

  //   return item
  // } catch (error) {
  //   return null
  // }
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
  return null
  // try {
  //   const userId = await getCurrentUserId()
  //   if (!userId) throw new Error()

  //   if (request.imageUrls)
  //     request.imageUrls = insertImageUrlsPlaceholders(request.imageUrls)

  //   const formData = await toFormData(request)

  //   const { item } = await ITEM_ENDPOINTS._UPSERT_USER_ITEM(
  //     userId,
  //     formData,
  //     itemSlug,
  //   )

  //   return item
  // } catch (error) {
  //   return null
  // }
}

export const DELETE_ITEM = async (itemSlug: string): Promise<boolean> => {
  return false
  // try {
  //   const userId = await getCurrentUserId()
  //   if (!userId) throw new Error()

  //   await ITEM_ENDPOINTS._DELETE_USER_ITEM(userId, itemSlug)

  //   return true
  // } catch (error) {
  //   return false
  // }
}

export const UPDATE_ITEM_STATUS = async (
  itemSlug: string,
  status: ItemStatus,
): Promise<boolean> => {
  return false
  // try {
  //   const userId = await getCurrentUserId()
  //   if (!userId) throw new Error()

  //   const formData = await toFormData({ status })

  //   await ITEM_ENDPOINTS._UPSERT_USER_ITEM(userId, formData, itemSlug)

  //   return true
  // } catch (error) {
  //   return false
  // }
}
