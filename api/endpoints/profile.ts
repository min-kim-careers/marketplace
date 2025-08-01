'use server'

import { client } from '@/api/_utils/client'
import { Profile } from '@/lib/types/profile'

export const _profileHandleExists = async (handle: string) =>
  (await client())
    .get(`/api/profiles/handle/${handle}`)
    .withSession()
    .asResult<{ exists: boolean }>()


export interface _ProfileExtra {
  imageLimit: number
  listingLimit: number
}
export const _getProfileExtra = async () =>
  (await client()).get(`/api/profiles/extra`).withSession().asResult<{
    extra: _ProfileExtra
  }>()

export interface _UpsertProfileRequest {
  email?: string
  handle?: string
  rating?: number
  ratingCount?: number
  postcode?: string
  suburb?: string
  state?: string
  avatarUrl?: string
}
export const _upsertProfile = async (request: _UpsertProfileRequest) =>
  (await client())
    .put(`/api/profiles`)
    .withSession()
    .setBody(request)
    .asResult<{ profile: Profile }>()
