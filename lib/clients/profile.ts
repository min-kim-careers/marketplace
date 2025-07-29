'use server'

import { Profile } from '@/lib/types/profile'
import { client } from '@/lib/utils/client'
import { ProfileExtra, UpsertProfileRequest } from '@gateway/api/profile'

export const UPSERT_PROFILE = async (request: UpsertProfileRequest) =>
  (await client())
    .put('/upsert-profile')
    .setBody(request)
    .asResult<{ profile: Profile }>({ withSession: true })

export const HANDLE_EXISTS = async (handle: string) =>
  (await client())
    .get(`/exists/handle/${handle}`)
    .asResult<{ exists: boolean }>({ withSession: true })

export const GET_PROFILE_EXTRA = async () =>
  (await client())
    .get(`/get-profile-extra`)
    .asResult<{ extra: ProfileExtra }>({ withSession: true })
