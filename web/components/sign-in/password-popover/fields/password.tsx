import { z } from 'zod'

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import { SignInWithPasswordSchema } from '@/components/sign-in/password-popover/schema'
import { UseFormReturn } from 'react-hook-form'

export default function PasswordField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SignInWithPasswordSchema>>
}) {
  const name = 'password'
  const type = 'password'
  const placeholder = 'Password*'

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className='flex items-center gap-2'>
              <Input
                {...field}
                id='email'
                type={type}
                placeholder={placeholder}
                onChange={(e) => {
                  field.onChange(e)
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
