'use server'

import { createApiAxios } from '@/_gateway/api/_config/axios'
import {
  CreateItemRequest,
  GetItemsRequest,
  UpdateItemRequest,
} from './service'
import { Item } from '@/lib/interfaces/item'

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

export const _UPDATE_USER_ITEM = async (
  userId: string,
  itemSlug: string,
  request: UpdateItemRequest,
): Promise<{ item: Item }> =>
  apiItemAxios
    .patch(`/user/${userId}/item/${itemSlug}`, request)
    .then((res) => res.data)

export const _CREATE_USER_ITEM = async (
  userId: string,
  request: CreateItemRequest,
): Promise<{ item: Item }> =>
  apiItemAxios
    .post(`/user/${userId}`, request)
    .then((res) => res.data)

export const _UPLOAD_USER_ITEM_IMAGES = async (
  userId: string,
  itemSlug: string,
  formData: FormData,
): Promise<{ item: Item }> =>
  apiItemAxios
    .post(
      `/user/${userId}/item/${itemSlug}/upload/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    .then((res) => res.data)
