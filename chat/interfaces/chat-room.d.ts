import { IItem } from '@/lib/interfaces/item'

export type ChatRoom = {
  id: string
  itemId: string
  createdAt: Date
  updatedAt: Date
} & { item: IItem }
