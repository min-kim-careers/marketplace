import 'server-only'

import { client } from '@/api/_utils/client'
import { Item } from '@/lib/types/item'

export interface _GetItemsQuery {
  page: number
  keyword?: string
  sortBy?: string
  sortOrder?: string
  categories?: string[]
  limit?: number
  userOption?: 'exclude_user' | 'user_only'
  activeOnly?: boolean
}
export const _getItems = async (query: _GetItemsQuery) =>
  (await client())
    .get('/api/items')
    .withSession()
    .setQuery(query)
    .asResult<{ items: Item[]; count: number }>()

export const _getItemsCountForUser = async () =>
  (await client())
    .get('/api/items/count')
    .withSession()
    .asResult<{ count: number }>()

export const _getItemByAlias = async (itemAlias: string) =>
  (await client())
    .get(`/api/items/item/${itemAlias}`)
    .withSession()
    .asResult<{ item: Item }>()

export const _deleteItemByUser = async (itemAlias: string) =>
  (await client())
    .delete(`/api/items/item/${itemAlias}`)
    .withSession()
    .asResult<{ deleted: boolean }>()

export interface _UpsertItemQuery {
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
export const _upsertItem = async (
  form: FormData,
  query: { itemAlias?: string },
) =>
  (await client())
    .put(`/api/items`)
    .withSession()
    .setQuery(query)
    .setForm(form)
    .asResult<{ item: Item }>()
