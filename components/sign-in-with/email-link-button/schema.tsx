import { z } from 'zod'

export const SignInWithEmailLinkSchema = z.object({
  email: z.string().trim().nonempty('Email required').email('Invalid email'),
})
