import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { ItemFormSchema } from '@/components/00_common/item-form/schema'
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
import { getLocationLabel, searchLocations } from '@/lib/utils/fuse/locations'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useEffect, useState } from 'react'

const name = 'location' as const
const label = 'Location' as const
const placeholder = 'Search for a location, e.g. Sydney or 2000' as const

export default function LocationField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof ItemFormSchema>>
}) {
  const [locations, setLocations] = useState<LocationJSON[]>([])
  const [currentLabel, setCurrentLabel] = useState<string>(placeholder)
  const [openPopover, setOpenPopover] = useState<boolean>(false)

  useEffect(() => {
    const existingLocation = form.getValues(name)
    if (
      !existingLocation ||
      !existingLocation.postcode ||
      !existingLocation.state ||
      !existingLocation.state
    )
      return

    const label = getLocationLabel({
      ...existingLocation,
    })
    if (label) {
      setCurrentLabel(label)
    }
  }, [])

  const handleSearch = (value: string) => {
    try {
      const locations = searchLocations(value)
      setLocations(locations)
    } catch (error) {
      console.error(error)
      setLocations([])
    }
  }

  const handleOnSelect = (location: LocationJSON) => {
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
    setOpenPopover(false)
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className='flex flex-col gap-2'>
          <FormLabel>{label}</FormLabel>
          <Popover open={openPopover} onOpenChange={setOpenPopover}>
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
                  onValueChange={handleSearch}
                />
                <CommandList>
                  <CommandEmpty>No {name} found.</CommandEmpty>
                  <CommandGroup>
                    {locations
                      .map((l) => (
                        <CommandItem
                          value={l.label}
                          key={l.label}
                          onSelect={() => handleOnSelect(l)}
                        >
                          <>
                            <p>{l.label}</p>
                            <Check
                              className={cn(
                                'ml-auto',
                                l.label === currentLabel
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                          </>
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
