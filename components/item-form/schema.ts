import { ITEM_CATEGORY_LABELS } from '@/lib/constants/item-category-labels'
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { z } from 'zod'

export const ItemFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      message: 'Name must be at least 2 characters long',
    })
    .max(50, {
      message: 'Name must be at most 50 characters long',
    }),

  description: z
    .string()
    .trim()
    .min(10, {
      message: 'Description must be at least 10 characters long',
    })
    .max(255, {
      message: `Description must be at most 255 characters long`,
    }),

  price: z
    .number({ coerce: true })
    .min(0)
    .multipleOf(0.01, { message: 'Max 2 decimal places' }),

  category: z.enum(Object.keys(ITEM_CATEGORY_LABELS) as [string, ...string[]], {
    message: 'Category is required',
  }),

  condition: z.enum(
    Object.keys(ITEM_CONDITION_LABELS) as [string, ...string[]],
    { message: 'Condition is required' },
  ),

  location: z
    .object({
      postcode: z.string(),
      suburb: z.string(),
      state: z.string(),
    })
    .refine((v) => v.postcode.trim() && v.state.trim() && v.suburb.trim(), {
      message: 'Location is required',
    }),

  imageUrls: z.array(z.string().nullable()),
})
