'use server'

import { _getSession, _revokeSession, _verifySession } from '@/api/endpoints'
import { hasSession } from '@/lib/helpers/server/has-session'
import { setSession } from '@/lib/helpers/server/set-session'

export const signInWithGoogle = async (token: string) => {
  try {
    const { profile, session } = await _getSession(token)
    await setSession(session.value, session.expiry)
    return profile
  } catch (error) {
    console.error(error)
  }
}

export const verifySession = async () => {
  try {
    if (!(await hasSession())) {
      console.log('session missing')
      return false
    }
    await _verifySession()
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const revokeSession = async () => {
  try {
    if (!(await hasSession())) {
      console.log('session missing')
      return false
    }
    await _revokeSession()
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
