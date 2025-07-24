'use server'

import { ItemStatus } from '@/lib/enums/item-status'
import { toFormData } from '@/lib/helpers/to-form-data'
import { toSearchParams } from '@/lib/helpers/to-search-params'
import { Item } from '@/lib/interfaces/item'
import { ItemPageParams } from '@/lib/interfaces/item-page-params'
import { createClient } from '@/lib/utils/create-client'
import { envLoader } from '@/lib/utils/env-loader'
import { UpsertItemRequest } from '@gateway/services/api/item'

const client = await createClient(envLoader.gatewayUrl)

export const getAllItems = async (itemPageParams: ItemPageParams) =>
  await client.get<{ items: Item[]; count: number }>(
    `/get-all-items?${toSearchParams(itemPageParams)}`,
  )

export const getAllUserItems = async (itemPageParams: ItemPageParams) =>
  await client.get<{ items: Item[]; count: number }>(
    `/get-all-user-items?${toSearchParams(itemPageParams)}`,
  )

export const getItemByUser = async (itemSlug: string) =>
  await client.get<{ item: Item }>(`/get-item-by-user/itemSlug/${itemSlug}`)

const _insertImageUrlsPlaceholders = (imageUrls: string[]) => {
  let placeholder_index = 0
  imageUrls.map((url) => {
    return url.startsWith('blob:') ? `{{${placeholder_index++}}}` : url
  })
  return imageUrls
}

export const upsertItem = async (
  request: UpsertItemRequest,
  itemSlug?: string,
): Promise<{ item: Item }> => {
  try {
    if (request.imageUrls) {
      request.imageUrls = _insertImageUrlsPlaceholders(request.imageUrls)
    }

    const formData = await toFormData(request)

    return await client.put<{ item: Item }>(
      `/upsert-item/itemSlug/${itemSlug}`,
      { body: formData },
    )
  } catch (error) {
    throw new Error()
  }
}

export const deleteItem = async (itemSlug: string): Promise<boolean> => {
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

export const updateItemStatus = async (
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
