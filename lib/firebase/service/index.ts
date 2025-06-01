'use server'

import {
  serviceCreateProfile,
  serviceGetProfile,
} from '@/_gateway/api/profiles/service'
import { adminAuth } from '@/lib/firebase/configs/admin'
import { uidToUuid } from '@/lib/firebase/service/helpers'
import { Profile } from '@/lib/interfaces/profiles'
import { cookies } from 'next/headers'
import { DecodedIdToken } from 'firebase-admin/auth'

const SESSION_KEY = 'session'

export const firebaseCreateProfile = async (
  idToken: string,
  handle?: string,
): Promise<Profile | null> => {
  try {
    const decodedToken =
      await adminAuth.verifyIdToken(idToken)

    const { uid, email } = decodedToken

    if (!uid) throw new Error('Uid missing')
    if (!email) throw new Error('Email missing')

    const userId = uidToUuid(uid)

    if (!handle) {
      adminAuth.setCustomUserClaims(uid, {
        profileCompleted: false,
      })
    } else {
      adminAuth.setCustomUserClaims(uid, {
        profileCompleted: true,
      })
    }

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
