'use server'

import { getSessionCookie } from '@/_gateway/auth/_config/helpers'
import { _VERIFY_SESSION } from '@/_gateway/auth/firebase/endpoints'
import { ApiErrorResponse } from './interfaces'
import { logError } from '@/lib/utils/log'
import { AxiosError } from 'axios'

export const logApiError = async (error: any) => {
  if (error instanceof AxiosError) {
    const apiError = error.response
      ?.data as ApiErrorResponse
    if (apiError) logError(apiError)
  } else {
    logError(error)
  }
}

export const cleanObject = async (obj: Object) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ]),
  )

export const getCurrentUserId = async (): Promise<
  string | null
> => {
  const session = await getSessionCookie()
  if (!session) return null

  const { userId } = await _VERIFY_SESSION(session)
  return userId
}
