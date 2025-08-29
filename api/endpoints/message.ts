import 'server-only'

import { client } from '@/api/_utils/client'

export interface _GetMessagesRequest {
  page: number
  keyword?: string
  sortBy?: string
  sortOrder?: string
  limit?: number
  buyerHandle: string
  sellerHandle: string
  itemAlias: string
}

export const _getMessages = async (request: _GetMessagesRequest) =>
  (await client())
    .get('/api/messages')
    .setQuery(request)
    .withSession()
    .asResult<{ messages: Message[] }>()

export type Message = {
  isSeller: boolean
  content: string
  createdAt: string
  updatedAt: string
}

export interface _AddMessageRequest {
  itemAlias: string
  peerHandle: string
}

export const _addMessage = async (request: _AddMessageRequest) =>
  (await client())
    .post('/api/messages')
    .withSession()
    .setQuery(request)
    .asResult<{ message: Message }>()
