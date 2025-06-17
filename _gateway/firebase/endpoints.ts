'use server'

import { createFirebaseAxios } from '@/_gateway/firebase/_config/axios'
import { DecodedToken } from '@/_gateway/firebase/interfaces'
import { APP_DATA } from '@/lib/constants/app-data'

const firebaseAxios = await createFirebaseAxios('/firebase')

export const FIREBASE_ENDPOINTS = {
  GET_SESSION: (
    idToken: string,
  ): Promise<{
    decodedToken: DecodedToken
    sessionCookie: string
    expiresInSeconds: number
  }> =>
    firebaseAxios
      .post(`/session`, { idToken })
      .then((res) => res.data),

  VERIFY_SESSION: (
    session: string,
  ): Promise<{ decodedToken: DecodedToken }> =>
    firebaseAxios
      .post(
        `/session/verify`,
        {},
        {
          headers: {
            Cookie: `${APP_DATA.SESSION_HEADER}=${session}`,
          },
        },
      )
      .then((res) => res.data),
}
