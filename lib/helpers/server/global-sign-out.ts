'use server'

import { REVOKE_SESSION } from '@/gateway/auth'
import { clearSession } from '@/lib/helpers/server/clear-session'

export const globalSignOut = async () => {
  try {
    await REVOKE_SESSION()
  } catch (error) {
    console.error(error)
  } finally {
    await clearSession()
  }
}
