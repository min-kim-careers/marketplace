'use server'

import { ApiErrorResponse } from '@/_gateway/api/_interfaces/api-error.response'
import { AxiosError } from 'axios'

export const logApiError = async (error: any) => {
  if (error instanceof AxiosError) {
    const apiError = error.response
      ?.data as ApiErrorResponse
    if (apiError) console.log(apiError)
  }
}

