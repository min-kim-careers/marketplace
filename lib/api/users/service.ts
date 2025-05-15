'use server'

import usersApi from '@/lib/api/users'
import {
  GetProfileResponse,
  GetUserIdResponse,
} from '@/lib/api/users/responses'

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
