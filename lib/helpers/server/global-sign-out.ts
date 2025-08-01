'use server'

import { _revokeSession } from '@/api/endpoints/auth-firebase'
import { clearSession } from '@/lib/helpers/server/clear-session'

export const globalSignOut = async () => {
  try {
    await _revokeSession()
  } catch (error) {
    console.error(error)
  } finally {
    await clearSession()
  }
}
