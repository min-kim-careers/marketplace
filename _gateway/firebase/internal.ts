'use server'

import { firebaseAxios } from '@/_gateway/firebase/_config/axios'
import { FIREBASE_ENDPOINTS } from './_config/endpoints'
import { DecodedToken } from '@/_gateway/firebase/_models/token'

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

export interface InternalVerify {
  decodedToken: DecodedToken
  profileCreated: boolean
}

export const internalVerify = async (
  session: string,
): Promise<InternalVerify> => {
  try {
    const response = await firebaseAxios.post(
      FIREBASE_ENDPOINTS.VERIFY_TOKEN,
      {
        headers: {
          Cookie: `__session=${session}`,
        },
      },
    )

    const { decodedToken }: InternalVerify = response.data

    if (!decodedToken)
      throw new Error('Missing decoded token')

    return response.data
  } catch (error) {
    throw error
  }
}

export interface InternalSetProfileCreated {
  decodedToken: DecodedToken
}

export const internalSetProfileCreated = async (
  idToken: string,
): Promise<InternalSetProfileCreated> => {
  try {
    const response = await firebaseAxios.patch(
      FIREBASE_ENDPOINTS.SET_PROFILE_CREATED,
      { idToken },
    )

    const { decodedToken }: InternalSetProfileCreated =
      response.data

    if (!decodedToken)
      throw new Error('Missing decoded token')

    return response.data
  } catch (error) {
    throw error
  }
}
