import { ItemCategory } from '@/lib/enums/item-category'

export const ITEM_CATEGORY_LABELS: Record<
  ItemCategory,
  string
> = {
  [ItemCategory.CPU]: 'CPU',
  [ItemCategory.GPU]: 'GPU',
  [ItemCategory.RAM]: 'RAM',
  [ItemCategory.Motherboard]: 'Motherboard',
  [ItemCategory.PSU]: 'PSU',
  [ItemCategory.Storage]: 'Storage',
  [ItemCategory.Case]: 'Case',
  [ItemCategory.Cooling]: 'Cooling',
  [ItemCategory.Monitor]: 'Monitor',
  [ItemCategory.Peripheral]: 'Peripheral',
  [ItemCategory.Software]: 'Software',
  [ItemCategory.Other]: 'Other',
}
