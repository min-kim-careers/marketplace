'use server'

import { Profile } from '@/lib/types/profile'
import { makeClient } from '@/lib/utils/client'
import { ProfileExtra, UpsertProfileRequest } from '@gateway/api/profile'

export const UPSERT_PROFILE = async (request: UpsertProfileRequest) =>
  (await makeClient())
    .put('/upsert-profile')
    .setBody(request)
    .parseResult<{ profile: Profile }>({ withSession: true })

export const HANDLE_EXISTS = async (handle: string) =>
  (await makeClient())
    .get(`/exists/handle/${handle}`)
    .parseResult<{ exists: boolean }>({ withSession: true })

// export const GET_USER_ID_BY_HANDLE = async (handle: string) =>
//   (await makeClient())
//     .get(`/get-user-id-by-handle/handle/${handle}`)
//     .parsedResult<{ userId: string }>({ withSession: true })

export const GET_PROFILE_EXTRA = async () =>
  (await makeClient())
    .get(`/get-profile-extra`)
    .parseResult<{ extra: ProfileExtra }>({ withSession: true })
