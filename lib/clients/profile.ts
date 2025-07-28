'use server'

import { Profile } from '@/lib/types/profile'
import { gateway } from '@/lib/utils/client'
import { ProfileExtra, UpsertProfileRequest } from '@gateway/api/profile'

export const UPSERT_PROFILE = async (request: UpsertProfileRequest) =>
  (await gateway())
    .put('/upsert-profile')
    .setBody(request)
    .asResult<{ profile: Profile }>({ withSession: true })

export const HANDLE_EXISTS = async (handle: string) =>
  (await gateway())
    .get(`/exists/handle/${handle}`)
    .asResult<{ exists: boolean }>({ withSession: true })

// export const GET_USER_ID_BY_HANDLE = async (handle: string) =>
//   (await makeClient())
//     .get(`/get-user-id-by-handle/handle/${handle}`)
//     .parsedResult<{ userId: string }>({ withSession: true })

export const GET_PROFILE_EXTRA = async () =>
  (await gateway())
    .get(`/get-profile-extra`)
    .asResult<{ extra: ProfileExtra }>({ withSession: true })
