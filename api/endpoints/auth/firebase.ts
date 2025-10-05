import 'server-only'

import { client } from '@/api/_utils/client'
import { Profile } from '@/lib/types/profile'

export type _GetSessionRequest = {
  idToken: string
  nonce?: string
  isNewUser?: boolean
}
export const _getSession = async (request: _GetSessionRequest) =>
  (await client())
    .post(`/auth/firebase/session`)
    .setBody(request)
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
