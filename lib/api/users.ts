'use server'

import { UsersResponse } from '@/lib/interfaces/users'
import { ENDPOINTS } from '../constants/endpoints'
import { createApi } from './_common'

const usersApi = createApi(ENDPOINTS.USERS)

export const signUp = async (
  email: string,
  password: string,
  handle: string,
): Promise<UsersResponse> => {
  const data = { email, password, handle }

  return await usersApi
    .post('/sign-up', data)
    .then((response) => response.data as UsersResponse)
    .catch((error) => {
      console.error(error)
      throw error
    })
}

export const verifyUser =
  async (): Promise<UsersResponse> => {
    return await usersApi
      .get('/verify')
      .then((response) => response.data as UsersResponse)
      .catch((error) => {
        console.error(error)
        throw error
      })
  }

export const fetchProfile =
  async (): Promise<UsersResponse> => {
    return await usersApi
      .get('/profile')
      .then((response) => response.data as UsersResponse)
      .catch((error) => {
        console.error(error)
        throw error
      })
  }
