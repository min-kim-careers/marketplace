import { ItemPostFormSchema } from '@/components/02_main/item-post/form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Textarea } from '@/components/shadcn/components/ui/textarea'
import {
  useState
} from 'react'
import {
  UseFormReturn
} from 'react-hook-form'
import { z } from 'zod'

export default function DescriptionField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ItemPostFormSchema>>
}) {
  const name = 'description'
  const label = 'Description'
  const placeholder = 'Provide details about the item'

  const [charCount, setCharCount] = useState(0)
  const charLimit = 255

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col gap-2'>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className='h-[150px]'
              {...field}
              onChange={(e) => {
                field.onChange(e)
                setCharCount(e.target.value.length)
              }}
              maxLength={charLimit}
            />
          </FormControl>
          <FormDescription className='flex justify-end'>
            Character count: {charCount} / {charLimit}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
