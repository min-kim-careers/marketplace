import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Textarea } from '@/components/shadcn/components/ui/textarea'
import { MAX_DESCRIPTION_LENGTH } from '@/lib/constants/fields'
import { ItemPostFormSchema } from '@/components/02_main/protected/item/post/form'
import {
  ChangeEvent,
  ClipboardEvent,
  useState,
} from 'react'
import {
  ControllerRenderProps,
  UseFormReturn,
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
  const charLimit = MAX_DESCRIPTION_LENGTH

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    field: ControllerRenderProps<
      z.infer<typeof ItemPostFormSchema>
    >,
  ) => {
    const { value } = e.target

    if (value.length <= charLimit) {
      setCharCount(value.length)
      field.onChange(e)
    }
  }

  const handlePaste = (
    e: ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      charCount + e.clipboardData.getData.length >=
      charLimit
    ) {
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
            <Textarea
              placeholder={placeholder}
              className='h-[150px]'
              {...field}
              onChange={(e) => handleChange(e, field)}
              onPaste={handlePaste}
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
