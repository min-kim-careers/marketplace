'use server'

import { buildUpsertItemForm } from '@/lib/helpers/server/build-upsert-item-form'
import { Item } from '@/lib/types/item'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { makeClient } from '@/lib/utils/client'
import { UpsertItemRequest } from '@gateway/api/item'

export const GET_ALL_ITEMS = async (itemPageParams: ItemPageParams) =>
  (await makeClient())
    .get(`/get-all-items`)
    .addQuery(itemPageParams)
    .result<{ items: Item[]; count: number }>({ withSession: true })

export const GET_ALL_ITEMS_BY_USER = async (itemPageParams: ItemPageParams) =>
  (await makeClient())
    .get(`/get-all-items-by-user`)
    .addQuery(itemPageParams)
    .result<{
      items: Item[]
      count: number
    }>({ withSession: true })

export const GET_ITEM_BY_USER = async (itemId: string) =>
  (await makeClient())
    .get(`/get-item-by-id/itemId/${itemId}`)
    .result<{ item: Item }>({ withSession: true })

export const UPSERT_ITEM = async (
  request: UpsertItemRequest,
  query: { itemId?: string },
): Promise<{ item: Item }> =>
  (await makeClient())
    .put(`/upsert-item`)
    .addQuery(query)
    .addBody(await buildUpsertItemForm(request))
    .result<{ item: Item }>({ withSession: true })

export const DELETE_ITEM = async (itemId: string) =>
  (await makeClient())
    .delete(`/delete-item/itemId/${itemId}`)
    .result<{ deleted: boolean }>({ withSession: true })
