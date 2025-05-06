'use server'

import { AuthResponse } from '../../interfaces/auth/response'
import { UserAuth } from '../../interfaces/users'
import authApi from '.'

export const signIn = async (
  userAuth: UserAuth,
): Promise<AuthResponse> => {
  const formData = new FormData()
  formData.append('username', userAuth.email)
  formData.append('password', userAuth.password)

  return await authApi
    .post(
      '/sign-in',
      formData,
      { withCredentials: true },
    )
    .then((response) => response.data as AuthResponse)
    .catch((error) => {
      throw error
    })
}
