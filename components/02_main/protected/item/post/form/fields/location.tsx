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
import { getLocationList } from '@/lib/utils/fuse/locations'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { Location } from '@/lib/utils/fuse/location'
import { logError } from '@/lib/utils/log'

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
  const [locations, setLocations] = useState<Location[]>([])
  const [currentLabel, setCurrentLabel] = useState(placeholder)

  const handleChange = async (value: string) => {
    try {
      setQuery(value)
      setLoading(true)
      const res = await getLocationList(value)
      setLocations(res)
    } catch (error) {
      logError('Location field error')
    } finally {
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
                    !currentLabel && 'text-muted-foreground',
                  )}
                >
                  {currentLabel || placeholder}
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
                          value={location.label}
                          key={i}
                          onSelect={(_) => {
                            form.setValue(name, location.postcode, {
                              shouldValidate: true,
                            })
                            setCurrentLabel(location.label)
                          }}
                        >
                          {location.label}
                          <Check
                            className={cn(
                              'ml-auto',
                              location.label ===
                                currentLabel
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
