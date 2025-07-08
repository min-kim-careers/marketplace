'use server'

import { createApiAxios } from '@/_gateway/api/_config/axios'
import { IItem } from '@/lib/interfaces/item'
import { GenericFormData } from 'axios'
import { GetItemsRequest, UpsertItemRequest } from './service'

const apiItemAxios = await createApiAxios('/api/items')

export const _GET_ALL_ITEMS = async (
  request: GetItemsRequest,
): Promise<{ items: IItem[]; count: number }> =>
  apiItemAxios.get(``, { params: request }).then((res) => res.data)

export const _GET_USER_ITEMS = async (
  userId: string,
  request: GetItemsRequest,
): Promise<{ items: IItem[]; count: number }> =>
  apiItemAxios
    .get(`/user/${userId}`, {
      params: request,
    })
    .then((res) => res.data)

export const _GET_USER_ITEM = async (
  userId: string,
  itemSlug: string,
): Promise<{ item: IItem }> =>
  apiItemAxios.get(`/user/${userId}/item/${itemSlug}`).then((res) => res.data)

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
): Promise<{ item: IItem }> =>
  apiItemAxios
    .putForm(`/user/${userId}`, formData, {
      params: { itemSlug },
    })
    .then((res) => res.data)

export const _CREATE_USER_ITEM = async (
  userId: string,
  request: UpsertItemRequest,
): Promise<{ item: IItem }> =>
  apiItemAxios.post(`/user/${userId}`, request).then((res) => res.data)

export const _GET_ITEMS_BY_IDS = async (
  userId: string,
  itemSlugs: string[],
): Promise<{ items: IItem[] }> =>
  apiItemAxios
    .get(`/user/${userId}/items`, { params: { itemSlugs } })
    .then((res) => res.data)
