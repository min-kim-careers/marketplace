'use server'

import { UserCreate } from '../../interfaces/users'
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
      throw Error()
    })
}

export const signUp = async (
  userCreate: UserCreate,
): Promise<UserResponse> => {
  return await usersApi
    .post('/sign-up', userCreate)
    .then((response) => response.data as UserResponse)
    .catch((error) => {
      throw Error()
    })
}
