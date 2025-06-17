'use server'

import { createApiAxios } from '@/_gateway/api/_config/axios'
import {
  CreateItemRequest,
  GetItemsRequest,
  UpdateItemRequest
} from "./service"
import { Item } from '@/lib/interfaces/item'

const apiItemAxios = await createApiAxios('/api/items')

export const ITEM_ENDPOINTS = {
  GET_ITEMS: (
    request: GetItemsRequest,
  ): Promise<{ items: Item[]; count: number }> =>
    apiItemAxios
      .get(``, { params: request })
      .then((res) => res.data),

  GET_USER_ITEMS: (
    userId: string,
    request: GetItemsRequest,
  ): Promise<{ items: Item[]; count: number }> =>
    apiItemAxios
      .get(`/user/${userId}`, {
        params: request,
      })
      .then((res) => res.data),

  GET_USER_ITEM: (
    userId: string,
    itemId: number,
  ): Promise<{ item: Item }> =>
    apiItemAxios
      .get(`/user/${userId}/item/${itemId}`)
      .then((res) => res.data),

  DELETE_USER_ITEM: (
    userId: string,
    itemId: number,
  ): Promise<{ deleted: boolean }> =>
    apiItemAxios
      .delete(`/user/${userId}/item/${itemId}`)
      .then((res) => res.data),

  UPDATE_USER_ITEM: (
    userId: string,
    itemId: number,
    request: UpdateItemRequest,
  ): Promise<{ item: Item }> =>
    apiItemAxios
      .patch(`/user/${userId}/item/${itemId}`, request)
      .then((res) => res.data),

  CREATE_USER_ITEM: (
    userId: string,
    request: CreateItemRequest,
  ): Promise<{ item: Item }> =>
    apiItemAxios
      .post(`/user/${userId}`, request)
      .then((res) => res.data),

  UPLOAD_USER_ITEM_IMAGES: (
    userId: string,
    itemId: number,
    formData: FormData,
  ): Promise<{ item: Item }> =>
    apiItemAxios
      .post(
        `/user/${userId}/item/${itemId}/upload/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then((res) => res.data),
}
