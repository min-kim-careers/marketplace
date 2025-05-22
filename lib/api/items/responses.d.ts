import { Item } from "@/lib/interfaces/items";

export interface GetItemsResponse {
  items: Item[]
  count: number
}

export interface GetSortOptionsResponse {
  sortOptions: string[]
}