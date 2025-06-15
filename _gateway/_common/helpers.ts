'use server'

import {
  getSessionCookie,
  createUserId,
} from '@/_gateway/firebase/_config/helpers'
import { verifySession } from '@/_gateway/firebase/service'
import { REQUEST_HEADERS } from '@/lib/constants/request-headers'
import { logError } from '@/lib/utils/log'
import { cookies } from 'next/headers'

export const getCookieHeader = async (session: string) => {
  return {
    headers: {
      Cookie: `${REQUEST_HEADERS.SESSION}=${session}`,
    },
  }
}

export const attachCookieHeader = async () => {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(
      REQUEST_HEADERS.SESSION,
    )?.value
    if (!session) throw Error('No session to attach')

    return {
      headers: {
        Cookie: `${REQUEST_HEADERS.SESSION}=${session}`,
      },
    }
  } catch (error) {
    throw error
  }
}

export const getSessionUserId = async (): Promise<
  string | null
> => {
  try {
    const session = await getSessionCookie()
    if (!session) return null

    const decodedToken =
      await verifySession(session)

    const userId = createUserId(decodedToken.uid)

    return userId
  } catch (error) {
    logError(error)
    throw new Error('Error fetching current user ID')
  }
}
