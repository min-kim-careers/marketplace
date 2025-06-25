'use server'

import { createApiAxios } from '@/_gateway/api/_config/axios'
import { Item } from '@/lib/interfaces/item'
import { GenericFormData } from 'axios'
import {
  GetItemsRequest,
  UpsertItemRequest,
} from './service'

const apiItemAxios = await createApiAxios('/api/items')

export const _GET_ALL_ITEMS = async (
  request: GetItemsRequest,
): Promise<{ items: Item[]; count: number }> =>
  apiItemAxios
    .get(``, { params: request })
    .then((res) => res.data)

export const _GET_USER_ITEMS = async (
  userId: string,
  request: GetItemsRequest,
): Promise<{ items: Item[]; count: number }> =>
  apiItemAxios
    .get(`/user/${userId}`, {
      params: request,
    })
    .then((res) => res.data)

export const _GET_USER_ITEM = async (
  userId: string,
  itemSlug: string,
): Promise<{ item: Item }> =>
  apiItemAxios
    .get(`/user/${userId}/item/${itemSlug}`)
    .then((res) => res.data)

export const _DELETE_USER_ITEM = async (
  userId: string,
  itemSlug: string,
): Promise<{ deleted: boolean }> =>
  apiItemAxios
    .delete(`/user/${userId}/item/${itemSlug}`)
    .then((res) => res.data)

export const _UPSERT_USER_ITEM = async (
  userId: string,
  formData: GenericFormData,
  itemSlug?: string,
): Promise<{ item: Item }> =>
  apiItemAxios
    .putForm(`/user/${userId}`, formData, {
      params: { itemSlug },
    })
    .then((res) => res.data)

export const _CREATE_USER_ITEM = async (
  userId: string,
  request: UpsertItemRequest,
): Promise<{ item: Item }> =>
  apiItemAxios
    .post(`/user/${userId}`, request)
    .then((res) => res.data)


