'use server'

import { PostFormSchema } from '@/components/02_main/user/post/schema'
import { Profile } from '@/lib/interfaces/profile'
import { z } from 'zod'
import { APIParams } from '../interfaces/params'
import server from '../utils/axios'
import { ServerResponse } from '../interfaces/server'

export const fetchItems = async (
  params: APIParams,
): Promise<ServerResponse> => {
  return server
    .get('/get-items', {
      params,
    })
    .then((response) => response.data as ServerResponse)
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
