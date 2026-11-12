import { client } from '@/api/_utils/client'

export const _verifyChallenge = async (cfToken: string) =>
  (await client())
    .post(`/auth/cloudflare/verify-challenge`)
    .setBody({ cfToken })
    .asResult<{
      nonce: string
    }>()
