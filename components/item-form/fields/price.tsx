import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import { ItemFormSchema } from '@/components/item-form/schema'
import {
  ChangeEvent,
  ChangeEventHandler,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import {
  formatCurrency,
  unformatCurrency,
} from '@/lib/helpers/format-price'

export default function PriceField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ItemFormSchema>>
}) {
  const name = 'price'
  const label = 'Price'
  const placeholder = 'Enter the price in AUD, e.g., 150.00'

  const [price, setPrice] = useState('')

  useEffect(() => {
    const existingPrice = form.getValues(name)
    if (existingPrice) setPrice(formatCurrency(existingPrice.toString()))
  }, [])

  const allowedKeys = [
    'Backspace',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
  ]
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    // Allow control keys
    if (allowedKeys.includes(e.key)) return

    // Allow only one dot and digits
    const isDigit = /[0-9]/.test(e.key)
    const isDot =
      e.key === '.' && !e.currentTarget.value.includes('.')

    if (!isDigit && !isDot) {
      e.preventDefault()
    }
  }

  const handleSetPrice = (val: string) => {
    form.setValue(name, Number(val), {
      shouldValidate: true,
    })
    setPrice(val)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const newPrice = e.target.value

    if (!newPrice || newPrice === '00') {
      return handleSetPrice('0')
    }

    if (newPrice.startsWith('0')) {
      const stripped = newPrice.replaceAll('0', '')
      return handleSetPrice(stripped)
    }

    const split = newPrice.split('.')
    if (split.length > 1 && split[1].length > 2) return

    const valid = Number(newPrice)
    if (valid && newPrice.endsWith('.')) {
      handleSetPrice(newPrice)
    } else if (valid) {
      handleSetPrice(newPrice)
    }
  }

  const handleFocus = () => {
    if (!price) return handleSetPrice('0')
    setPrice(unformatCurrency(price).toString())
  }

  const handleBlur = () => {
    if (price === '0') return handleSetPrice('')
    setPrice(formatCurrency(price))
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
              inputMode='decimal'
              placeholder={placeholder}
              {...field}
              value={price}
              onKeyDown={handleKeyDown}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onPaste={(e) => e.preventDefault()}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
