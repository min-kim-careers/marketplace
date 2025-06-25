'use server'

import { createApiAxios } from '@/_gateway/api/_config/axios'
import { ProfileExtra } from './interfaces'
import { IProfile } from '@/lib/interfaces/profile'
import { UpsertProfileRequest } from '@/_gateway/api/profile/service'

const profileApiAxios =
  await createApiAxios('/api/profiles')

export const _GET_PROFILE = async (
  userId: string,
): Promise<{ profile: IProfile }> =>
  profileApiAxios
    .get(`/user/${userId}`)
    .then((res) => res.data)

export const _HANDLE_EXISTS = async (
  handle: string,
): Promise<{ exists: boolean }> =>
  profileApiAxios
    .get(`/exists/handle/${handle}`)
    .then((res) => res.data)

export const _GET_PROFILE_EXTRA = async (
  userId: string,
): Promise<{ extra: ProfileExtra }> =>
  profileApiAxios
    .get(`/user/${userId}/extra`)
    .then((res) => res.data)

export const _UPSERT_PROFILE = async (
  userId: string,
  request: UpsertProfileRequest,
): Promise<{ profile: IProfile }> =>
  profileApiAxios
    .put(`/user/${userId}`, request)
    .then((res) => res.data)
