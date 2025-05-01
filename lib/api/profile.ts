'use server'

import { Profile } from '../interfaces/profile'
import { APIResponse } from '../interfaces/response'
import api from '../utils/axios'

export const fetchProfile = async (
  userId: string,
): Promise<APIResponse> => {
  return await api
    .get('/get-profile', {
      params: {
        user_id: userId,
      },
    })
    .then((response) => response.data as APIResponse)
    .catch((error) => {
      throw error
    })
}

export const addProfile = async (
  userId: string,
  email: string,
  handle: string,
): Promise<APIResponse> => {
  const profile: Profile = {
    userId,
    email,
    handle,
    rating: 0,
    ratingCount: 0,
    avatarUrl: '',
    location: '',
  }

  return await api
    .post('/add-profile', profile)
    .then((response) => response.data as APIResponse)
    .catch((error) => {
      throw error
    })
}
