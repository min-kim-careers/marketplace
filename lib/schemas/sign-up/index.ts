import { z } from 'zod'

export const SignupFormSchema = z.object({
  handle: z
    .string()
    .min(3, {
      message: 'Handle must be at least 3 characters.',
    })
    .max(15, {
      message: 'Handle must be at most 15 characters.',
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        'Handle can only contain letters, numbers, and underscores.',
    })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email.' })
    .trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, {
      message: 'Contain at least one letter.',
    })
    .regex(/[0-9]/, {
      message: 'Contain at least one number.',
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
})
