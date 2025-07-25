'use server'

import { ItemStatus } from '@/lib/enums/item-status'
import { buildUpsertItemForm } from '@/lib/helpers/server/build-upsert-item-form'
import { toURLSearchParams } from '@/lib/helpers/to-url-search-params'
import { Item } from '@/lib/types/item'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { makeClient } from '@/lib/utils/client'
import { UpsertItemRequest } from '@gateway/api/item'

export const getAllItems = async (itemPageParams: ItemPageParams) =>
  await (await makeClient())
    .get(`/get-all-items`)
    .addQuery(itemPageParams)
    .result<{ items: Item[]; count: number }>({ withSession: true })

export const getAllUserItems = async (itemPageParams: ItemPageParams) =>
  await (await makeClient())
    .get(`/get-all-user-items`)
    .addQuery(itemPageParams)
    .result<{
      items: Item[]
      count: number
    }>({ withSession: true })

export const getItemByUser = async (itemSlug: string) =>
  await (await makeClient())
    .get(`/get-item-by-user/itemSlug/${itemSlug}`)
    .result<{ item: Item }>({ withSession: true })

export const upsertItem = async (
  request: UpsertItemRequest,
  itemSlug?: string,
): Promise<{ item: Item }> => {
  return await (
    await makeClient()
  )
    .put(`/upsert-item/itemSlug/${itemSlug}`)
    .addBody(await buildUpsertItemForm(request))
    .result<{ item: Item }>({ withSession: true })
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
