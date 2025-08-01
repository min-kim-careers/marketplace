'use server'

import { _getSession, _revokeSession, _verifySession } from '@/api/endpoints'
import { setSession } from '@/lib/helpers/server/set-session'

export const _signInWithGoogle = async (token: string) => {
  try {
    const { profile, session } = await _getSession(token)
    await setSession(session.value, session.expiry)
    return profile
  } catch (error) {
    console.error(error)
  }
}

export const verifySession = async () =>
  _verifySession()
    .then(() => true)
    .catch(() => false)

export const revokeSession = async () =>
  _revokeSession()
    .then(() => true)
    .catch(() => false)
