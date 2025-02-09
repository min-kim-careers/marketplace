import { z } from 'zod'
import {
  CATEGORIES,
  CONDITIONS,
  MAX_DESCRIPTION_LENGTH,
} from './constants'
import { checkLocationExists } from '@/lib/fuse/locations'

export const PostFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters long',
    })
    .max(50, {
      message: 'Name must be at most 50 characters long',
    })
    .trim()
    .refine((val) => val.trim() !== '', {
      message: 'Name is required',
    }),

  description: z
    .string()
    .min(10, {
      message:
        'Description must be at least 10 characters long',
    })
    .max(MAX_DESCRIPTION_LENGTH, {
      message: `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters long`,
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

  image_urls: z.array(z.string().url()),
})
