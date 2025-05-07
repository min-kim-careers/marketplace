'use server'

import { AuthResponse } from '../../interfaces/auth/response'
import authApi from '.'
import { UserResponse } from '@/lib/interfaces/users/response'
import { fetchUser } from '../user/service'

export const signIn = async (
  email: string,
  password: string,
): Promise<UserResponse> => {
  const formData = new FormData()
  formData.append('username', email)
  formData.append('password', password)

  const { success, userId } = await authApi
    .post('/sign-in', formData, { withCredentials: true })
    .then((response) => response.data as AuthResponse)
    .catch((error) => {
      throw error
    })

  if (!success || !!!userId) throw Error()

  return await fetchUser(userId)
}
