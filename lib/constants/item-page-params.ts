import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { DEFAULT_ITEM_SORT_OPTION } from '@/lib/constants/item-sort-options'
import { ItemPageParams } from '@/lib/interfaces/listings-params'

export const DEFAULT_ITEM_PAGE_PARAMS: ItemPageParams = {
  page: DEFAULT_ITEM_PAGINATION.PAGE,
  sortBy: DEFAULT_ITEM_SORT_OPTION.sortBy,
  sortOrder: DEFAULT_ITEM_SORT_OPTION.sortOrder,
}
