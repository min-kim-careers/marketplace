'use server'

import { createFirebaseAxios } from '@/_gateway/firebase/_config/axios'
import { FIREBASE_ENDPOINTS } from './_config/endpoints'
import { getCookieHeader } from '@/_gateway/_common/helpers'

const firebaseAxios = await createFirebaseAxios('/firebase')

export interface DecodedToken {
  uid: string
  email: string
  picture: string
}

export const _getSession = async (
  idToken: string,
): Promise<{
  decodedToken: DecodedToken
  sessionCookie: string
  expiresInSeconds: number
}> => {
  try {
    const response = await firebaseAxios.post(
      FIREBASE_ENDPOINTS.GET_SESSION,
      { idToken },
    )
    const {
      decodedToken,
      sessionCookie,
      expiresInSeconds,
    } = response.data

    if (!decodedToken)
      throw new Error('Missing decoded token')
    if (!sessionCookie)
      throw new Error('Missing session cookie')
    if (!expiresInSeconds)
      throw new Error('Missing expiry in seconds')

    return response.data
  } catch (error) {
    throw error
  }
}

export const _verifySession = async (
  session: string,
): Promise<{
  decodedToken: DecodedToken
}> => {
  try {
    const response = await firebaseAxios.post(
      FIREBASE_ENDPOINTS.VERIFY_SESSION,
      {},
      await getCookieHeader(session),
    )

    const { decodedToken } = response.data

    if (!decodedToken)
      throw new Error('Missing decoded token')

    return response.data
  } catch (error) {
    throw error
  }
}
