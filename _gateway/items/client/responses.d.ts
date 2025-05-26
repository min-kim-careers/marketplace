import { ClientResponseModel } from '@/_gateway/_models/client/response'
import { Item } from '@/lib/interfaces/items'

export interface GetItemsClientResponse
  extends ClientResponseModel {
  items: Item[]
  count: number
}

export interface GetSortOptionsClientResponse
  extends ClientResponseModel {
  sortOptions: SortOption[]
}
