'use server'

import {
  getSessionCookie,
  createUserId,
} from '@/_gateway/firebase/_config/helpers'
import { serviceVerifySession } from '@/_gateway/firebase/service'
import { REQUEST_HEADERS } from '@/lib/constants/request-headers'
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

export const getCurrentUserId = async (): Promise<
  string | null
> => {
  try {
    const session = await getSessionCookie()
    if (!session) throw new Error('No session found')

    const decodedToken =
      await serviceVerifySession(session)

    const userId = createUserId(decodedToken.uid)

    return userId
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching current user ID')
  }
}
