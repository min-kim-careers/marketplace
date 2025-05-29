import { checkLocationExists } from '@/lib/utils/fuse/locations'
import { z } from 'zod'
import {
  CATEGORIES,
  CONDITIONS,
  MAX_DESCRIPTION_LENGTH,
} from '@/lib/constants/form'


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
    .max(MAX_DESCRIPTION_LENGTH, {
      message: `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters long`,
    }),

  price: z
    .number()
    .min(0, { message: 'Price must be a positive number' }),

  category: z.enum(
    Object.keys(CATEGORIES) as [string, ...string[]],
    {
      message: 'Category is required',
    },
  ),

  condition: z.enum(
    Object.keys(CONDITIONS) as [string, ...string[]],
    { message: 'Condition is required' },
  ),

  location: z
    .string({ message: 'Location is required' })
    .refine((val) => checkLocationExists(val), {
      message: 'Invalid location',
    }),

  expires_in: z.number(),

  image_urls: z
    .array(z.string().url())
    .max(3)
    .optional()
})
