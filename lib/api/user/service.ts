'use server'

import { UserResponse } from '../../interfaces/users/response'
import usersApi from '.'

export const fetchUser = async (
  userId: string,
): Promise<UserResponse> => {
  return await usersApi
    .get('/me', {
      params: {
        user_id: userId,
      },
    })
    .then((response) => response.data as UserResponse)
    .catch((error) => {
      throw error
    })
}

export const signUp = async (
  email: string,
  password: string,
  handle: string,
): Promise<UserResponse> => {
  return await usersApi
    .post('/sign-up', {email, password, handle})
    .then((response) => response.data as UserResponse)
    .catch((error) => {
      throw error
    })
}
