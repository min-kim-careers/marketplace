import { Item } from '@/lib/interfaces/items'

export interface GetItemsServerResponse {
  items: Item[]
  count: number
}

export interface GetSortOptionsServerResponse {
  sortOptions: SortOption[]
}
