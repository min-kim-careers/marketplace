'use server'

import { firebaseAxios } from '@/_gateway/firebase/_config/axios'
import { FIREBASE_ENDPOINTS } from './_config/endpoints'
import { DecodedToken } from '@/_gateway/firebase/_models/decoded-token'
import { HEADERS } from '@/lib/constants/headers'

export interface InternalGetSession {
  decodedToken: DecodedToken
  sessionCookie: string
  expiresInSeconds: number
}

export const internalGetSession = async (
  idToken: string,
): Promise<InternalGetSession> => {
  try {
    const response = await firebaseAxios.post(
      FIREBASE_ENDPOINTS.GET_SESSION,
      { idToken },
    )
    const {
      decodedToken,
      sessionCookie,
      expiresInSeconds,
    }: InternalGetSession = response.data

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

export interface InternalVerifySession {
  decodedToken: DecodedToken
}

export const internalVerifySession = async (
  session: string,
): Promise<InternalVerifySession> => {
  try {
    const response = await firebaseAxios.post(
      FIREBASE_ENDPOINTS.VERIFY_SESSION,
      {},
      {
        headers: {
          Cookie: `${HEADERS.SESSION}=${session}`,
        },
      },
    )

    const { decodedToken }: InternalVerifySession = response.data

    if (!decodedToken)
      throw new Error('Missing decoded token')

    return response.data
  } catch (error) {
    throw error
  }
}