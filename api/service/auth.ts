'use server'

import { _getSession, _GetSessionRequest, _revokeSession, _verifySession } from '@/api/endpoints'
import { _verifyChallenge } from '@/api/endpoints/auth/cloudflare'
import { setSession } from '@/lib/helpers/server/set-session'

export type GetSessionRequest = _GetSessionRequest
export const getSession = async (request: GetSessionRequest) => {
  try {
    const { profile, session } = await _getSession(request)
    await setSession(session.value, session.expiry)
    return profile
  } catch (error) {
    console.error(error)
  }
}

export const verifySession = async () => {
  try {
    await _verifySession()
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const revokeSession = async () => {
  try {
    await _revokeSession()
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const verifyChallenge = async (cfToken: string) => {
  try {
    const { nonce } = await _verifyChallenge(cfToken)
    return nonce
  } catch (error) {
    console.error(error)
  }
}
