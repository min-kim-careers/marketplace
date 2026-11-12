import { z } from 'zod'

export const ProfileUpdateFormSchema = z.object({
  email: z.object({
    value: z.union([z.literal(''), z.string().email()]),
    confirmed: z.boolean(),
  }),
  handle: z.object({
    value: z.union([
      z.literal(''),
      z
        .string()
        .min(3, {
          message: 'Handle must be at least 3 characters.',
        })
        .max(15, {
          message: 'Handle must be at most 15 characters.',
        })
        .regex(/^[a-zA-Z0-9_]+$/, {
          message: 'Handle can only contain letters, numbers, and underscores.',
        })
        .trim(),
    ]),
    confirmed: z.boolean(),
  }),
})