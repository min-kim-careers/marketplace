'use server'

import { User } from '../interfaces/user'
import { APIResponse } from '../interfaces/response'
import usersApi from '../utils/axios/users'
import { z } from 'zod'
import { SignupFormSchema } from '@/components/01_header/auth-dialog/sign-up-form/schema'

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
  user: User,
): Promise<APIResponse> => {
  return await usersApi
    .post('/add', user)
    .then((response) => response.data as APIResponse)
    .catch((error) => {
      throw error
    })
}
