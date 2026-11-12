import { ItemCondition } from '@/lib/enums/item-condition'

export const ITEM_CONDITION_LABELS: Record<
  ItemCondition,
  string
> = {
  [ItemCondition.New]: 'New',
  [ItemCondition.Used]: 'Used',
  [ItemCondition.Refurbished]: 'Refurbished',
  [ItemCondition.Defective]: 'Defective',
} as const
