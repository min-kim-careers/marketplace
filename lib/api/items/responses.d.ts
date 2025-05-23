import { Item } from "@/lib/interfaces/items";

export interface GetItemsResponse {
  items: Item[]
  count: number
}

export interface GetSortOptionsResponse {
  sortOptions: SortOption[]
}

export interface SortOption {
  sortBy: string
  sortOrder: string
  label: string
  isDefault: bool
}