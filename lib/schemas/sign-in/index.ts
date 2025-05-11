import { z } from 'zod'

export const SignInFormSchema = z.object({
  email: z
    .string({ message: 'Email is required.' })
    .email({ message: 'Please enter a valid email.' })
    .trim(),
  password: z
    .string({ message: 'Password is required.' })
    .trim(),
})