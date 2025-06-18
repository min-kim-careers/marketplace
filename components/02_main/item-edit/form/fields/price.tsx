import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import { ItemEditFormSchema } from '@/components/02_main/item-edit/form'
import { KeyboardEvent } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export default function PriceField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ItemEditFormSchema>>
}) {
  const name = 'price'
  const label = 'Price'
  const type = 'number'
  const placeholder = 'Enter the price in AUD, e.g., 150.00'

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
      e.preventDefault()
    }
  }

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
              step={"0.01"}
              min={0}
              placeholder={placeholder}
              onKeyDown={handleKeyDown}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
