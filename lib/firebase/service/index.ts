'use server'

import {
  serviceCreateProfile,
  serviceGetProfile,
} from '@/_gateway/api/profiles/service'
import { adminAuth } from '@/lib/firebase/configs/server'
import { uidToUuid } from '@/lib/firebase/service/helpers'
import { Profile } from '@/lib/interfaces/profiles'
import { cookies } from 'next/headers'
import { DecodedIdToken } from 'firebase-admin/auth'

const SESSION_KEY = 'session'

export const firebaseSetSession = async (
  idToken: string,
): Promise<boolean> => {
  try {
    await adminAuth.verifyIdToken(idToken)

    const expiresIn = 60 * 60 * 24 * 5 * 1000

    const sessionCookie =
      await adminAuth.createSessionCookie(idToken, {
        expiresIn,
      })

    const cookieStore = await cookies()

    cookieStore.set(SESSION_KEY, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: expiresIn / 1000,
      path: '/',
    })
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const firebaseClearSession =
  async (): Promise<void> => {
    try {
      const cookieStore = await cookies()

      cookieStore.delete(SESSION_KEY)
    } catch (error) {
      console.error(error)
    }
  }

export const firebaseGetProfileByToken = async (
  idToken: string,
): Promise<Profile | null> => {
  try {
    const decodedToken =
      await adminAuth.verifyIdToken(idToken)

    const uid = decodedToken.uid

    if (!uid) throw new Error('Uid missing')

    const userId = uidToUuid(uid)

    const { profile } = await serviceGetProfile(userId)

    return profile
  } catch (error) {
    console.error(error)
    return null
  }
}

export const firebaseGetProfileByUid = async (
  uid: string,
): Promise<Profile | null> => {
  try {
    const userId = uidToUuid(uid)

    const { profile } = await serviceGetProfile(userId)

    return profile
  } catch (error) {
    console.error(error)
    return null
  }
}

export const firebaseCreateProfile = async (
  idToken: string,
  handle: string,
): Promise<Profile | null> => {
  try {
    const decodedToken =
      await adminAuth.verifyIdToken(idToken)

    const { uid, email } = decodedToken

    if (!uid) throw new Error('Uid missing')
    if (!email) throw new Error('Email missing')

    const userId = uidToUuid(uid)

    const { profile } = await serviceCreateProfile(
      userId,
      email,
      handle,
    )

    return profile
  } catch (error) {
    console.error(error)
    return null
  }
}

export const firebaseGetProfileBySession =
  async (): Promise<Profile | null> => {
    try {
      const cookieStore = await cookies()
      const sessionCookie =
        cookieStore.get(SESSION_KEY)?.value

      if (!sessionCookie) throw new Error('No session')

      const decodedToken =
        await adminAuth.verifySessionCookie(
          sessionCookie,
          true,
        )

      const uid = decodedToken.uid

      if (!uid) throw new Error('Uid missing')

      const userId = uidToUuid(uid)

      const { profile } = await serviceGetProfile(userId)

      return profile
    } catch (error) {
      console.error(error)
      return null
    }
  }

export const firebaseGetVerifiedSession =
  async (): Promise<DecodedIdToken | null> => {
    try {
      const cookieStore = await cookies()
      const sessionCookie =
        cookieStore.get(SESSION_KEY)?.value

      if (!sessionCookie) return null

      const decodedToken =
        await adminAuth.verifySessionCookie(
          sessionCookie,
          true,
        )
      return decodedToken
    } catch (error) {
      console.error(error)
      return null
    }
  }
