import { ItemPagination } from '@/lib/interfaces/item-pagination'

export const DEFAULT_ITEM_PAGINATION: ItemPagination = {
  PAGE: 1,
  LIMIT: 9,
  SIZE: 5,
} as const
