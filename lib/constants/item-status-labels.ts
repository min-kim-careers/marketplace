import { ItemStatus } from '@/lib/enums/item-status'

export const ITEM_STATUS_LABELS: Record<
  ItemStatus,
  string
> = {
  [ItemStatus.Available]: 'Available',
  // [ItemStatus.Expired]: 'Expired',
  [ItemStatus.Pending]: 'Pending',
  [ItemStatus.Sold]: 'Sold',
  [ItemStatus.Inactive]: 'Inactive',
}
