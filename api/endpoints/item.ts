'use server'

import { client } from '@/api/_utils/client'
import { Item } from '@/lib/types/item'

export interface _GetItemsRequest {
  page: number
  keyword?: string
  sortBy?: string
  sortOrder?: string
  categories?: string[]
  limit?: number
  userOption?: 'exclude_user' | 'user_only'
  activeOnly?: boolean
}
export const _getItems = async (request: _GetItemsRequest) =>
  (await client())
    .get('/api/items')
    .withSession()
    .setQuery(request)
    .asResult<{ items: Item[]; count: number }>()

export const _getItemsCountForUser = async () =>
  (await client())
    .get('/api/items/count')
    .withSession()
    .asResult<{ count: number }>()

export const _getItemBySlug = async (itemSlug: string) =>
  (await client())
    .get(`/api/items/item/${itemSlug}`)
    .withSession()
    .asResult<{ item: Item }>()

export const _deleteItemByUser = async (itemSlug: string) =>
  (await client())
    .delete(`/api/items/item/${itemSlug}`)
    .withSession()
    .asResult<{ deleted: boolean }>()

export interface _UpsertItemRequest {
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
  query: { itemSlug?: string },
) =>
  (await client())
    .put(`/api/items`)
    .withSession()
    .setQuery(query)
    .setForm(form)
    .asResult<{ item: Item }>()
