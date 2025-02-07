import { z } from 'zod'
import { CATEGORIES, CONDITIONS } from './constants'
import { checkLocationExists } from '@/lib/fuse/locations'

export const postSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters long',
    })
    .max(50, {
      message: 'Name must be at most 50 characters long',
    })
    .refine((val) => val.trim() !== '', {
      message: 'Name is required',
    }),

  description: z
    .string()
    .min(10, {
      message:
        'Description must be at least 10 characters long',
    })
    .refine((val) => val.trim() !== '', {
      message: 'Description is required',
    }),

  price: z
    .number()
    .min(0, { message: 'Price must be a positive number' })
    .refine((val) => !isNaN(val), {
      message: 'Price is required',
    }),

  image_url: z
    .string()
    .url({ message: 'Image URL must be a valid URL' })
    .refine((val) => val.trim() !== '', {
      message: 'Image URL is required',
    }),

  category: z
    .enum(Object.keys(CATEGORIES) as [string, ...string[]], {
      message: 'Category is required',
    }),

  condition: z.enum(
    Object.keys(CONDITIONS) as [string, ...string[]],
    { message: 'Condition is required' },
  ),
  location: z
    .string({ message: 'Location is required' })
    .refine((val) => checkLocationExists(val), {
      message: 'Invalid location',
    }),
})
