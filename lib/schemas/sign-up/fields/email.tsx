import { z } from 'zod'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import { SignupFormSchema } from '@/lib/schemas/sign-up'
import { UseFormReturn } from 'react-hook-form'

export default function EmailField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof SignupFormSchema>>
}) {
  const name = 'email'
  const label = 'Email'
  const type = 'email'
  const placeholder = 'Enter your email'

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