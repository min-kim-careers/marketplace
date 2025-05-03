'use server'

import { APIResponse } from '../interfaces/response'
import { User, UserCreate } from '../interfaces/user'
import usersApi from '../utils/axios/users'

export const fetchUser = async (
  userId: string,
): Promise<APIResponse> => {
  return await usersApi
    .get('/get', {
      params: {
        user_id: userId,
      },
    })
    .then((response) => response.data as APIResponse)
    .catch((error) => {
      throw error
    })
}

export const addUser = async (
  user: UserCreate,
): Promise<APIResponse> => {
  return await usersApi
    .post('/create', { ...user })
    .then((response) => response.data as APIResponse)
    .catch((error) => {
      throw error
    })
}
