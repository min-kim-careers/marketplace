'use server'

import { ApiErrorResponse } from "./interfaces"
import { logError } from '@/lib/utils/log'
import { AxiosError } from 'axios'

export const logApiError = async (error: any) => {
  if (error instanceof AxiosError) {
    const apiError = error.response
      ?.data as ApiErrorResponse
    if (apiError) logError(apiError)
  }
}
