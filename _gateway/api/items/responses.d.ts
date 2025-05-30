import { Item } from '@/lib/interfaces/items'

export interface GetItemsServiceResponse {
  items: Item[]
  count: number
}

export interface GetSortOptionsServiceResponse {
  sortOptions: SortOption[]
}
