'use server'

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
