import { ItemCategory } from '@/lib/enums/item-category'
import { ItemCondition } from '@/lib/enums/item-condition'
import { ItemStatus } from '@/lib/enums/item-status'

export type Item = {
  id: string
  name: string
  description: string
  price: number
  brand?: string
  category: ItemCategory
  condition: ItemCondition
  status: ItemStatus
  createdAt: string
  updatedAt: string
  expiresAt?: string
  postcode: string
  suburb: string
  state: string
  imageUrls: string[]

  profileHandle: str
}
