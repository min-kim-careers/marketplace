'use server'

import { createHash } from '@/_gateway/auth/_config/helpers'

export const createRoomId = async (
  seller: string,
  item: string,
  buyer: string,
) => {
  const arr = [seller, item, buyer].toSorted()
  const hash = await createHash(arr.join('_'))
  return hash
}
