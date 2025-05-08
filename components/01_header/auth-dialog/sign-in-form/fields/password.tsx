import { z } from 'zod'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import { UseFormReturn } from 'react-hook-form'
import { SignInFormSchema } from '../schema'

export default function PasswordField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SignInFormSchema>>
}) {
  const name = 'password'
  const label = 'Password'
  const type = 'password'
  const placeholder = 'Enter your password'

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col gap-2'>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}