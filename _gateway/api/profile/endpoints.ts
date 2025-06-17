'use server'

import { createApiAxios } from '@/_gateway/api/_config/axios'
import {
  UpsertProfileRequest
} from "./service"
import { ProfileExtra } from './interfaces'
import { Profile } from '@/lib/interfaces/profile'

const profileApiAxios =
  await createApiAxios('/api/profiles')

export const PROFILE_ENDPOINTS = {
  GET_PROFILE: (
    userId: string,
  ): Promise<{ profile: Profile }> =>
    profileApiAxios
      .get(`/user/${userId}`)
      .then((res) => res.data),

  HANDLE_EXISTS: (
    handle: string,
  ): Promise<{ exists: boolean }> =>
    profileApiAxios
      .get(`/exists/handle/${handle}`)
      .then((res) => res.data),

  GET_PROFILE_EXTRA: (
    userId: string,
  ): Promise<{ extra: ProfileExtra }> =>
    profileApiAxios
      .get(`/user/${userId}/extra`)
      .then((res) => res.data),

  UPSERT_PROFILE: (
    userId: string,
    request: UpsertProfileRequest,
  ): Promise<{ profile: Profile }> =>
    profileApiAxios
      .put(`/user/${userId}`, request)
      .then((res) => res.data),
}
