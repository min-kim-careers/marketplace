import { Item } from '@/lib/interfaces/items'

export interface GetItemsInternalResponse {
  items: Item[]
  count: number
}

export interface GetSortOptionsInternalResponse {
  sortOptions: SortOption[]
}
