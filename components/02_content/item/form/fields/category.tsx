import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/shadcn/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/shadcn/components/ui/command'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/components/ui/popover'
import { cn } from '@/components/shadcn/lib/utils'
import { ITEM_CATEGORY_LABELS } from "@/lib/constants/item-category-labels"
import { ItemCategory } from "@/lib/enums/item-category"
import { ItemFormSchema } from '@/components/02_content/item/form'
import { Check, ChevronsUpDown } from 'lucide-react'

export default function CategoryField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ItemFormSchema>>
}) {
  const name = 'category'
  const label = 'Category'
  const lookup = ITEM_CATEGORY_LABELS
  const placeholder = 'Select an item category'

  const handleSearch = (value: string, search: string) =>
    value.startsWith(search) ? 1 : 0

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-col gap-2'>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  className={cn(
                    'justify-between',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {lookup[field.value as ItemCategory] ?? placeholder}
                  <ChevronsUpDown className='opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='p-0'>
              <Command filter={handleSearch}>
                <CommandInput
                  placeholder={`Search ${name}...`}
                  className='h-9'
                />
                <CommandList>
                  <CommandEmpty>
                    No {name} found.
                  </CommandEmpty>
                  <CommandGroup>
                    {Object.keys(lookup).map((key) => (
                      <CommandItem
                        value={key}
                        key={key}
                        onSelect={(value) => {
                          form.setValue(name, value, {
                            shouldValidate: true,
                          })
                        }}
                      >
                        {lookup[key as ItemCategory]}
                        <Check
                          className={cn(
                            'ml-auto',
                            key === field.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
