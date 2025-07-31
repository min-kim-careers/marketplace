'use server'

import { buildUpsertItemForm } from '@/lib/helpers/server/build-upsert-item-form'
import { Item } from '@/lib/types/item'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { client } from '@/gateway/utils/client'
import { UpsertItemRequest } from '@gateway/api/item'

export const GET_ALL_ITEMS = async (itemPageParams: ItemPageParams) =>
  (await client())
    .get(`/get-all-items`)
    .setQuery(itemPageParams)
    .asResult<{ items: Item[]; count: number }>({ withSession: true })

export const GET_ALL_ITEMS_BY_USER = async (itemPageParams: ItemPageParams) =>
  (await client())
    .get(`/get-all-items-by-user`)
    .setQuery(itemPageParams)
    .asResult<{
      items: Item[]
      count: number
    }>({ withSession: true })

export const GET_ITEM_BY_USER = async (itemId: string) =>
  (await client())
    .get(`/get-item-by-id/${itemId}`)
    .asResult<{ item: Item }>({ withSession: true })

export const UPSERT_ITEM = async (
  request: UpsertItemRequest,
  query: { itemId?: string },
): Promise<{ item: Item }> =>
  (await client())
    .put(`/upsert-item`)
    .setQuery(query)
    .setForm(await buildUpsertItemForm(request))
    .asResult<{ item: Item }>({ withSession: true })

export const DELETE_ITEM = async (itemId: string) =>
  (await client())
    .delete(`/delete-item-by-id/${itemId}`)
    .asResult<{ deleted: boolean }>({ withSession: true })
