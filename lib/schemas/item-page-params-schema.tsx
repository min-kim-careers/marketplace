import { ITEM_CATEGORY_LABELS } from '@/lib/constants/item-category-labels'
import { ItemSortBy } from '@/lib/enums/item-sort-by'
import { ItemSortOrder } from '@/lib/enums/item-sort-order'
import { z } from 'zod'

const validateSortBy = (val: string) =>
  Object.values(ItemSortBy).includes(val as ItemSortBy)

const validateSortOrder = (val: string) =>
  Object.values(ItemSortOrder).includes(val as ItemSortOrder)

const validateCategories = (val: string) =>
  Object.keys(ITEM_CATEGORY_LABELS).includes(val)

export const ItemPageParamsSchema = z
  .object({
    page: z.coerce.number().positive(),
    sortBy: z
      .string()
      .trim()
      .refine((val) => validateSortBy(val)),
    sortOrder: z
      .string()
      .trim()
      .refine((val) => validateSortOrder(val)),
    keyword: z.string().trim().optional(),
    categories: z
      .union([
        z.array(
          z
            .string()
            .trim()
            .refine((val) => validateCategories(val)),
        ),
        z
          .string()
          .trim()
          .refine((val) => validateCategories(val)),
      ])
      .optional()
      .transform((val) => (typeof val === 'string' ? [val] : val)),
  })
  .strict()
