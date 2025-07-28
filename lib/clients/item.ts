'use server'

import { buildUpsertItemForm } from '@/lib/helpers/server/build-upsert-item-form'
import { Item } from '@/lib/types/item'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { gateway } from '@/lib/utils/client'
import { UpsertItemRequest } from '@gateway/api/item'

export const GET_ALL_ITEMS = async (itemPageParams: ItemPageParams) =>
  (await gateway())
    .get(`/get-all-items`)
    .setQuery(itemPageParams)
    .asResult<{ items: Item[]; count: number }>({ withSession: true })

export const GET_ALL_ITEMS_BY_USER = async (itemPageParams: ItemPageParams) =>
  (await gateway())
    .get(`/get-all-items-by-user`)
    .setQuery(itemPageParams)
    .asResult<{
      items: Item[]
      count: number
    }>({ withSession: true })

export const GET_ITEM_BY_USER = async (itemId: string) =>
  (await gateway())
    .get(`/get-item-by-id/itemId/${itemId}`)
    .asResult<{ item: Item }>({ withSession: true })

export const UPSERT_ITEM = async (
  request: UpsertItemRequest,
  query: { itemId?: string },
) =>
  (await gateway())
    .put(`/upsert-item`)
    .setQuery(query)
    .setForm(await buildUpsertItemForm(request))
    .asResult<{ item: Item }>({ withSession: true })

export const DELETE_ITEM = async (itemId: string) =>
  (await gateway())
    .delete(`/delete-item/itemId/${itemId}`)
    .asResult<{ deleted: boolean }>({ withSession: true })
