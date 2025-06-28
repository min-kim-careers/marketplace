'use server'

import { createAuthAxios } from '@/_gateway/auth/_config/axios'
import { FirebaseUser } from '@/_gateway/auth/firebase/interfaces'
import { APP_DATA } from '@/lib/constants/app-data'

const authFirebaseAxios = await createAuthAxios(
  '/auth/firebase',
)

export const _GET_SESSION = async (
  idToken: string,
): Promise<{
  userId: string

  firebaseUser: FirebaseUser
  sessionCookie: string
  expiresInSeconds: number
}> =>
  authFirebaseAxios
    .post(`/get-session`, { idToken })
    .then((res) => res.data)

export const _VERIFY_SESSION = async (
  session: string,
): Promise<{
  userId: string
}> =>
  authFirebaseAxios
    .post(
      `/verify-session`,
      {},
      {
        headers: {
          Cookie: `${APP_DATA.SESSION_HEADER}=${session}`,
        },
      },
    )
    .then((res) => res.data)
