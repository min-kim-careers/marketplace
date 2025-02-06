import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email({
    message: 'Email must be a valid email address',
  }),
  handle: z
    .string()
    .min(2, {
      message: 'Handle must be at least 2 characters',
    })
    .max(50, {
      message: 'Handle must be under 50 characters',
    }),

  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters',
    })
    .max(128, {
      message:
        'Password must be no longer than 128 characters',
    }),
  // .regex(/[a-z]/, {
  //   message:
  //     'Password must contain at least one lowercase letter',
  // })
  // .regex(/[A-Z]/, {
  //   message:
  //     'Password must contain at least one uppercase letter',
  // })
  // .regex(/[0-9]/, {
  //   message: 'Password must contain at least one number',
  // })
  // .regex(/[!@#$%^&*(),.?":{}|<>]/, {
  //   message:
  //     'Password must contain at least one special character',
  // }),
})
