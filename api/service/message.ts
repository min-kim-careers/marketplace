'use server'

import {
  _addMessage,
  _AddMessageRequest,
  _getMessages,
  _GetMessagesRequest,
} from '@/api/endpoints'

export const addMessage = async (request: _AddMessageRequest) => {
  try {
    const { message } = await _addMessage(request)
    return message
  } catch (error) {
    console.error(error)
  }
}

export interface GetMessagesRequest extends _GetMessagesRequest {}
export const getMessages = async (request: GetMessagesRequest) => {
  try {
    const { messages } = await _getMessages({ ...request })
    return messages
  } catch (error) {
    console.error(error)
  }
}
