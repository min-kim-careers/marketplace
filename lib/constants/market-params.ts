import { DEFAULT_ITEM_PAGINATION } from '@/lib/constants/item-pagination'
import { DEFAULT_ITEM_SORT_OPTION } from '@/lib/constants/item-sort-options'
import { IItemPageParams } from '@/lib/interfaces/item-page-params'

export const DEFAULT_MARKET_PARAMS: IItemPageParams = {
  page: DEFAULT_ITEM_PAGINATION.PAGE,
  sortBy: DEFAULT_ITEM_SORT_OPTION.sortBy,
  sortOrder: DEFAULT_ITEM_SORT_OPTION.sortOrder,
}
