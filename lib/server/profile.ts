'use server'

import { Profile } from '../interfaces/profile'
import { ServerResponse } from '../interfaces/server'
import server from '../utils/axios'

export const fetchProfile = async (
  userId: string,
): Promise<ServerResponse> => {
  return await server
    .get('/get-profile', {
      params: {
        user_id: userId,
      },
    })
    .then((response) => response.data as ServerResponse)
    .catch((error) => {
      throw error
    })
}

export const addProfile = async (
  profile: Profile,
): Promise<ServerResponse> => {
  return await server
    .post('/add-profile', profile)
    .then((response) => response.data as ServerResponse)
    .catch((error) => {
      throw error
    })
}
