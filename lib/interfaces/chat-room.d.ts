import { IItem } from '@/lib/interfaces/item'

export interface IChatRoom {
  id: string
  itemId: string
  createdAt: Date
  updatedAt: Date

  item?: IItem
}
