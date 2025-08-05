'use server'

import { client } from '@/api/_utils/client'
import { Profile } from '@/lib/types/profile'

export const _getSession = async (idToken: string) =>
  (await client())
    .post(`/auth/firebase/session`)
    .setBody({ idToken })
    .asResult<{
      profile: Profile
      session: { value: string; expiry: number }
    }>()

export const _verifySession = async () =>
  (await client())
    .post(`/auth/firebase/session/verify`)
    .withSession()
    .asResult()

export const _revokeSession = async () =>
  (await client())
    .post(`/auth/firebase/session/revoke`)
    .withSession()
    .asResult()
