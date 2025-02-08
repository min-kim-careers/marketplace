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
import { searchLocations } from '@/lib/fuse/locations'
import { Check, ChevronsUpDown } from 'lucide-react'
import { KeyboardEvent, useState } from 'react'
import { PostFormSchema } from '../schema'
import Spinner from '@/components/ui/spinner'

export default function Location({
  form,
}: {
  form: UseFormReturn<z.infer<typeof PostFormSchema>>
}) {
  const name = 'location'
  const label = 'Location'
  const placeholder = 'Search for a location, e.g., Sydney'

  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [locations, setLocations] = useState<string[]>([])

  const handleSearch = async (
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      setLoading(true)
      const res = await searchLocations(query)
      setLocations(res)
      setLoading(false)
    }
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
                  onValueChange={setQuery}
                  onKeyDown={handleSearch}
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
                            form.setValue(name, value)
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
