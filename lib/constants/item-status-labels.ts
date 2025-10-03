import { ItemStatus } from '@/lib/enums/item-status'

export const ITEM_STATUS_LABELS: Partial<Record<ItemStatus, string>> = {
  [ItemStatus.Available]: 'Available',
  [ItemStatus.Pending]: 'Pending',
  [ItemStatus.Sold]: 'Sold',
  [ItemStatus.Inactive]: 'Inactive',
} as const
