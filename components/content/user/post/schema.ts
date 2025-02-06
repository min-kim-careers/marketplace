import { z } from 'zod'

export const postSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50),
  description: z.string().min(10),
  price: z
    .number()
    .min(0),
  image_url: z
    .string()
    .url(),
  category: z.string(),
  condition: z.string(),
  location: z.string(),
})
