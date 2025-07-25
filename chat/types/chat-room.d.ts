import { Item } from '@/lib/types/item'

export type ChatRoom = {
  id: string
  itemId: string
  createdAt: Date
  updatedAt: Date
} & { item: Item }
