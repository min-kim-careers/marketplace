import 'server-only'

import { client } from '@/api/_utils/client'

export const _getRoomSlug = async (peerHandle: string) =>
  (await client())
    .post(`/api/chat/peerHandle/${peerHandle}`)
    .withSession()
    .asResult<{
      roomSlug: string
    }>()
