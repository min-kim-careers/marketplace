'use server'

import {
  getSessionCookie,
  convertToUUID,
} from '@/_gateway/auth/_config/helpers'
import { VERIFY_SESSION } from '@/_gateway/auth/firebase/service'
import { APP_DATA } from "@/lib/constants/app-data"
import { logError } from '@/lib/utils/log'
import { cookies } from 'next/headers'

export const getCookieHeader = async (session: string) => {
  return {
    headers: {
      Cookie: `${APP_DATA.SESSION_HEADER}=${session}`,
    },
  }
}

export const attachCookieHeader = async () => {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(
      APP_DATA.SESSION_HEADER,
    )?.value
    if (!session) throw Error('No session to attach')

    return {
      headers: {
        Cookie: `${APP_DATA.SESSION_HEADER}=${session}`,
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

    const firebaseUser =
      await VERIFY_SESSION(session)

    const userId = convertToUUID(firebaseUser.uid)

    return userId
  } catch (error) {
    logError(error)
    throw new Error('Error fetching current user ID')
  }
}
