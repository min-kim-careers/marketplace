'use server'

import { PostFormSchema } from '@/components/02_main/user/post/schema'
import { User } from '@/lib/interfaces/user'
import { z } from 'zod'
import { APIParams } from '../interfaces/params'
import itemsApi from '../utils/axios/items'
import { APIResponse } from '../interfaces/response'

export const fetchItems = async (
  params: APIParams,
): Promise<APIResponse> => {
  return itemsApi
    .get('/get', {
      params,
    })
    .then((response) => response.data as APIResponse)
    .catch((error) => {
      throw error
    })
}

export const insertItem = async (
  formData: z.infer<typeof PostFormSchema>,
  user: User,
) => {
  return null
}
