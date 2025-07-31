'use server'

import { client } from '@/gateway/utils/client'
import { Profile } from '@/lib/types/profile'
import { UpsertProfileRequest } from '@gateway/api/profile'

export const UPSERT_PROFILE = async (request: UpsertProfileRequest) =>
  (await client())
    .put('/upsert-profile')
    .setBody(request)
    .asResult<{ profile: Profile }>({ withSession: true })

export const HANDLE_EXISTS = async (handle: string) =>
  (await client())
    .get(`/exists-by-handle/${handle}`)
    .asResult<{ exists: boolean }>({ withSession: true })

export const GET_ITEM_POST_RESTRAINTS = async () =>
  (await client())
    .get(`/get-item-post-restraints`)
    .asResult<{ imageLimit: number; listingLimitExceeded: boolean }>({ withSession: true })
