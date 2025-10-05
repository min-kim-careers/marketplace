import { z } from 'zod'

export const SignInWithPasswordSchema = z.object({
  email: z.string().trim().nonempty('Email required').email('Invalid email'),
  password: z.string().trim().min(8, 'Password must be at least 8 characters'),
  nonce: z.string().nonempty('Complete the CAPTCHA'),
})
