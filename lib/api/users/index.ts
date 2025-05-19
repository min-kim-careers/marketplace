'use server'

import { createApi } from '@/lib/api/_common/config'
import {
  GetProfileResponse,
  GetUserIdResponse,
} from '@/lib/api/users/responses'

const usersApi = createApi('')

export const getProfile =
  async (): Promise<GetProfileResponse> => {
    return await usersApi
      .get('/profile')
      .then((response) => response.data)
      .catch((error) => {
        console.error('Server error')
        throw new Error()
      })
  }

export const getUserId =
  async (): Promise<GetUserIdResponse> => {
    return await usersApi
      .get('/id')
      .then((response) => response.data)
      .catch((error) => {
        console.error('Server error')
        throw new Error()
      })
  }
