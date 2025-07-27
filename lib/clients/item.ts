'use server'

import { buildUpsertItemForm } from '@/lib/helpers/server/build-upsert-item-form'
import { Item } from '@/lib/types/item'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { makeClient } from '@/lib/utils/client'
import { UpsertItemRequest } from '@gateway/api/item'

export const GET_ALL_ITEMS = async (itemPageParams: ItemPageParams) =>
  (await makeClient())
    .get(`/get-all-items`)
    .setQuery(itemPageParams)
    .parseResult<{ items: Item[]; count: number }>({ withSession: true })

export const GET_ALL_ITEMS_BY_USER = async (itemPageParams: ItemPageParams) =>
  (await makeClient())
    .get(`/get-all-items-by-user`)
    .setQuery(itemPageParams)
    .parseResult<{
      items: Item[]
      count: number
    }>({ withSession: true })

export const GET_ITEM_BY_USER = async (itemId: string) =>
  (await makeClient())
    .get(`/get-item-by-id/itemId/${itemId}`)
    .parseResult<{ item: Item }>({ withSession: true })

export const UPSERT_ITEM = async (
  request: UpsertItemRequest,
  query: { itemId?: string },
): Promise<{ item: Item }> =>
  (await makeClient())
    .put(`/upsert-item`)
    .setQuery(query)
    .setForm(await buildUpsertItemForm(request))
    .parseResult<{ item: Item }>({ withSession: true })

export const DELETE_ITEM = async (itemId: string) =>
  (await makeClient())
    .delete(`/delete-item/itemId/${itemId}`)
    .parseResult<{ deleted: boolean }>({ withSession: true })
