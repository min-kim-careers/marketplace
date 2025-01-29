import { z } from 'zod'

export const postSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters',
    })
    .max(50, {
      message: 'Name must be under 50 characters',
    }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters',
  }),
  price: z
    .number()
    .min(0, { message: 'Price must be a positive number' }),
  image_url: z
    .string()
    .url({ message: 'Image URL must be a valid URL' }),
  category: z.string(),
  suburb: z.string().min(2, {
    message: 'Suburb must be at least 2 characters',
  }),
  state: z.string().min(2, {
    message: 'State must be at least 2 characters',
  }),
  condition: z.string(),
})
