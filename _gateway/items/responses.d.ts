import { GatewayResponse } from '@/_gateway/_common/response'
import { Item } from '@/lib/interfaces/items'

export interface GetItemsClientResponse
  extends GatewayResponse {
  items: Item[]
  count: number
}

export interface GetSortOptionsClientResponse
  extends GatewayResponse {
  sortOptions: SortOption[]
}
