import { ItemStatus } from '@/lib/enums/item-status'

export const ITEM_STATUS_COLORS: Record<ItemStatus, string> = {
  [ItemStatus.Available]: 'bg-green-500',
  [ItemStatus.Expired]: 'bg-red-400',
  [ItemStatus.Pending]: 'bg-yellow-400',
  [ItemStatus.Sold]: 'bg-blue-500',
  [ItemStatus.Inactive]: 'bg-gray-400',
}
