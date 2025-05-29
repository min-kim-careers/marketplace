import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import Spinner from '@/components/00_common/spinner'
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
import { ItemPostFormSchema } from '@/components/02_main/protected/item/post/form'
import { searchLocations } from '@/lib/utils/fuse/locations'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

export default function LocationField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ItemPostFormSchema>>
}) {
  const name = 'location'
  const label = 'Location'
  const placeholder = 'Search for a location, e.g., Sydney'

  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [locations, setLocations] = useState<string[]>([])

  // const handleSearch = async (
  //   e: KeyboardEvent<HTMLInputElement>,
  // ) => {
  //   if (e.key === 'Enter') {
  //     setLoading(true)
  //     const res = await searchLocations(query)
  //     setLocations(res)
  //     setLoading(false)
  //   }
  // }

  const handleChange = async (search: string) => {
    setQuery(search)
    setLoading(true)
    const res = await searchLocations(search)
    setLocations(res)
    setLoading(false)
  }

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
                  {field.value || placeholder}
                  <ChevronsUpDown className='opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='p-0'>
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder={`Search ${name}...`}
                  className='h-9'
                  value={query}
                  onValueChange={handleChange}
                  // onKeyDown={handleSearch}
                />
                <CommandList>
                  <CommandEmpty>
                    No {name} found.
                  </CommandEmpty>
                  <CommandGroup>
                    {loading ? (
                      <Spinner />
                    ) : (
                      locations.map((location, i) => (
                        <CommandItem
                          value={location}
                          key={i}
                          onSelect={(value) => {
                            form.setValue(name, value, {
                              shouldValidate: true,
                            })
                          }}
                        >
                          {location}
                          <Check
                            className={cn(
                              'ml-auto',
                              location === field.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))
                    )}
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
