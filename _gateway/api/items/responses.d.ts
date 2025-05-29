import { ServiceResponse } from '@/_gateway/_common/service.response'
import { Item } from '@/lib/interfaces/items'

export interface GetItemsServiceResponse
  extends ServiceResponse {
  items: Item[]
  count: number
}

export interface GetSortOptionsServiceResponse
  extends ServiceResponse {
  sortOptions: SortOption[]
}
