import { IItem } from '@/lib/interfaces/item'

export interface IChatRoom {
  id: string
  itemId: string
  createdAt: Date
  updatedAt: Date
}

export interface IChatRoomWithItem extends IChatRoom {
  item: IItem
}