import { locationExistsByPostcode } from '@/lib/utils/fuse/locations'
import { z } from 'zod'
import { ITEM_CONDITION_LABELS } from '@/lib/constants/item-condition-labels'
import { ITEM_CATEGORY_LABELS } from '@/lib/constants/item-category-labels'

export const ItemPostFormSchema = z.object({
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
      message:
        'Description must be at least 10 characters long',
    })
    .max(255, {
      message: `Description must be at most 255 characters long`,
    }),

  price: z.number({ coerce: true }).min(0),

  category: z.enum(
    Object.keys(ITEM_CATEGORY_LABELS) as [
      string,
      ...string[],
    ],
    {
      message: 'Category is required',
    },
  ),

  condition: z.enum(
    Object.keys(ITEM_CONDITION_LABELS) as [
      string,
      ...string[],
    ],
    { message: 'Condition is required' },
  ),

  location: z
    .string()
    .nonempty({ message: 'Location is required' })
    .refine(
      (postcode) => locationExistsByPostcode(postcode),
      {
        message: 'Invalid location',
      },
    ),

  // expiresIn: z.number(),

  imageUrls: z
    .array(z.string())
    .max(3),
})
