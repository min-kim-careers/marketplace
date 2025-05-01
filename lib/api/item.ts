'use server'

import { PostFormSchema } from '@/components/02_main/user/post/schema'
import { Profile } from '@/lib/interfaces/profile'
import { z } from 'zod'
import { APIParams } from '../interfaces/params'
import api from '../utils/axios'
import { APIResponse } from '../interfaces/response'

export const fetchItems = async (
  params: APIParams,
): Promise<APIResponse> => {
  return api
    .get('/get-items', {
      params,
    })
    .then((response) => response.data as APIResponse)
    .catch((error) => {
      throw error
    })
}

export const insertItem = async (
  formData: z.infer<typeof PostFormSchema>,
  profile: Profile,
) => {
  return null
}
