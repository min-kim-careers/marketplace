import { ItemSortBy } from '@/lib/enums/item-sort-by'
import { ItemSortOrder } from '@/lib/enums/item-sort-order'
import { ItemSortOption } from '@/lib/interfaces/item-sort-options'

export const ITEM_SORT_OPTIONS: ItemSortOption[] = [
  {
    sortBy: ItemSortBy.CreatedAt,
    sortOrder: ItemSortOrder.Asc,
    label: 'Newest first',
    isDefault: true,
  },
  {
    sortBy: ItemSortBy.CreatedAt,
    sortOrder: ItemSortOrder.Desc,
    label: 'Oldest first',
  },
  {
    sortBy: ItemSortBy.UpdatedAt,
    sortOrder: ItemSortOrder.Asc,
    label: 'Recently updated',
  },
  {
    sortBy: ItemSortBy.UpdatedAt,
    sortOrder: ItemSortOrder.Desc,
    label: 'Least recently updated',
  },
  {
    sortBy: ItemSortBy.Price,
    sortOrder: ItemSortOrder.Asc,
    label: 'Lowest price',
  },
  {
    sortBy: ItemSortBy.Price,
    sortOrder: ItemSortOrder.Desc,
    label: 'Highest price',
  },
  {
    sortBy: ItemSortBy.Name,
    sortOrder: ItemSortOrder.Asc,
    label: 'Name A-Z',
  },
  {
    sortBy: ItemSortBy.Name,
    sortOrder: ItemSortOrder.Desc,
    label: 'Name Z-A',
  },
]

const validateItemSortOptions = () => {
  if (
    ITEM_SORT_OPTIONS.filter((i) => i.isDefault).length !==
    1
  )
    console.warn(
      'There must be exactly one default sort option',
    )
}

validateItemSortOptions()
