'use server'

import { createAuthAxios } from '@/_gateway/auth/_config/axios'
import { DecodedToken } from '@/_gateway/auth/interfaces'
import { APP_DATA } from '@/lib/constants/app-data'

const authAxios = await createAuthAxios('/firebase')

export const _GET_SESSION = async (
  idToken: string,
): Promise<{
  decodedToken: DecodedToken
  sessionCookie: string
  expiresInSeconds: number
}> =>
  authAxios
    .post(`/session`, { idToken })
    .then((res) => res.data)

export const _VERIFY_SESSION = async (
  session: string,
): Promise<{ decodedToken: DecodedToken }> =>
  authAxios
    .post(
      `/session/verify`,
      {},
      {
        headers: {
          Cookie: `${APP_DATA.SESSION_HEADER}=${session}`,
        },
      },
    )
    .then((res) => res.data)
