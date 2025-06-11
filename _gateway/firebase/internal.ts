'use server'

import { firebaseAxios } from '@/_gateway/firebase/_config/axios'
import { FIREBASE_ENDPOINTS } from './endpoints'
import { DecodedToken } from '@/_gateway/firebase/_interfaces/decoded-token'
import { getCookieHeader } from '@/_gateway/_common/helpers'

export const internalGetSession = async (
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

export const internalVerifySession = async (
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
