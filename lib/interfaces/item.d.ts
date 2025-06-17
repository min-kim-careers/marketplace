import { ItemCategory } from '@/lib/enums/item-category'
import { ItemCondition } from '@/lib/enums/item-condition'
import { ItemStatus } from '@/lib/enums/item-status'

export interface Item {
  id: number
  name: string
  description: string
  price: number
  brand?: string
  category: ItemCategory
  condition: ItemCondition
  status: ItemStatus
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
  postcode: string
  imageUrls: string[]

  profileHandle: str
}
