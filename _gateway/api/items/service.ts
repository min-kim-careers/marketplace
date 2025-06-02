'use server'

import { logError } from '@/_gateway/_common/helpers'
import {
  internalGetItems,
  internalGetSortOptions,
} from '@/_gateway/api/items/internal'
import {
  Item,
  ItemsQuery,
  SortOption,
} from '@/lib/interfaces/items'

export interface ServiceGetItems {
  items: Item[]
  count: number
}

export const serviceGetItems = async (
  query: ItemsQuery,
): Promise<ServiceGetItems> => {
  try {
    const res = await internalGetItems(query)

    return {
      items: res.items,
      count: res.count,
    } as ServiceGetItems
  } catch (error) {
    logError(error)
    return {
      items: [],
      count: 0,
    } as ServiceGetItems
  }
}

export const serviceGetSortOptions = async (): Promise<
  SortOption[]
> => {
  try {
    const res = await internalGetSortOptions()

    return res.sortOptions
  } catch (error) {
    logError(error)
    return []
  }
}
