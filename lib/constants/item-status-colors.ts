import { ItemStatus } from '@/lib/enums/item-status'

export const ITEM_STATUS_COLORS: Record<ItemStatus, string> = {
  [ItemStatus.Available]: 'lightgreen',
  // [ItemStatus.Expired]: 'red',
  [ItemStatus.Pending]: 'yellow',
  [ItemStatus.Sold]: 'lightblue',
  [ItemStatus.Inactive]: 'gray',
} as const
