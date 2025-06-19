import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import Spinner from '@/components/00_common/spinner'
import { ItemFormSchema } from '@/components/02_main/item/form'
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
import { LocationJSON } from '@/lib/utils/fuse/location-json'
import { searchLocations } from '@/lib/utils/fuse/locations'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'

export default function LocationField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ItemFormSchema>>
}) {
  const name = 'location'
  const label = 'Location'
  const placeholder =
    'Search for a location, e.g. Sydney or 2000'

  const [loading, setLoading] = useState(false)
  const [locations, setLocations] = useState<
    LocationJSON[]
  >([])
  const [currentLabel, setCurrentLabel] =
    useState(placeholder)

  const handleChange = (value: string) => {
    setLoading(true)
    try {
      const locations = searchLocations(value)
      setLocations(locations)
    } catch (_) {
      setLocations([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (location: LocationJSON) => {
    form.setValue(
      name,
      {
        postcode: location.postcode,
        suburb: location.locality,
        state: location.state,
      },
      {
        shouldValidate: true,
      },
    )
    setCurrentLabel(location.label)
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
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
                    !currentLabel &&
                      'text-muted-foreground',
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
                          onSelect={() =>
                            handleSelect(location)
                          }
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
