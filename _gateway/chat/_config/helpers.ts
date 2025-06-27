'use server'

import { ChatErrorResponse } from '@/_gateway/chat/_config/interfaces'
import { logError } from '@/lib/utils/log'
import { AxiosError } from 'axios'

export const logChatError = async (error: any) => {
  if (error instanceof AxiosError) {
    const chatError = error.response
      ?.data as ChatErrorResponse
    if (chatError) logError(chatError)
  } else {
    logError(error)
  }
}