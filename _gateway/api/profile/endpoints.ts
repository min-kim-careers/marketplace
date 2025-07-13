'use server'

import { createApiAxios } from '@/_gateway/api/_config/axios'
import { UpsertProfileRequest } from '@/_gateway/api/profile/service'
import { IProfileExtra } from './interfaces'
import { Profile } from '@/lib/interfaces/profile'

const profileApiAxios =
  await createApiAxios('/api/profiles')

export const _GET_PROFILE = async (
  userId: string,
): Promise<{ profile: Profile }> =>
  profileApiAxios
    .get(`/user/${userId}`)
    .then((res) => res.data)

export const _EXISTS_BY_HANDLE = async (
  handle: string,
): Promise<{ exists: boolean }> =>
  profileApiAxios
    .get(`/handle/${handle}`)
    .then((res) => res.data)

export const _GET_USER_ID_BY_HANDLE = async (
  handle: string,
): Promise<{ userId: string }> =>
  profileApiAxios
    .get(`/handle/${handle}/user-id`)
    .then((res) => res.data)

export const _GET_PROFILE_EXTRA = async (
  userId: string,
): Promise<{ extra: IProfileExtra }> =>
  profileApiAxios
    .get(`/user/${userId}/extra`)
    .then((res) => res.data)

export const _UPSERT_PROFILE = async (
  userId: string,
  request: UpsertProfileRequest,
): Promise<{ profile: Profile }> =>
  profileApiAxios
    .put(`/user/${userId}`, request)
    .then((res) => res.data)
