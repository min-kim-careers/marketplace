'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/shadcn/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/components/ui/popover'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { cn } from '@/components/shadcn/lib/utils'
import { ROUTES } from '@/constants/routes'
// import useAuthStore from '@/store/auth-store'
import Spinner from '@/components/ui/spinner'
import { searchLocations } from '@/lib/fuse/locations'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { KeyboardEvent, useState } from 'react'
import { CATEGORIES, CONDITIONS } from './constants'
import { postSchema } from './schema'

export default function Post() {
  // const { profile } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      image_url: '',
      category: '',
      location: '',
      condition: '',
    },
  })

  async function onSubmit(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    values: z.infer<typeof postSchema>,
  ) {
    // await insertItem({
    //   ...values,
    //   created_at: new Date(),
    //   updated_at: new Date(),
    //   user_handle: profile?.handle,
    //   user_email: profile?.email,
    // } as Item)

    router.push(ROUTES.SEARCH)
    toast({
      description:
        'Your item has been posted successfully!',
    })
  }

  const InputField = ({
    name,
    label,
    placeholder,
  }: {
    name: keyof z.infer<typeof postSchema>
    label: string
    placeholder?: string
  }) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className='flex flex-col gap-2'>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  const DropdownField = ({
    name,
    label,
    placeholder,
    lookup,
  }: {
    name: keyof z.infer<typeof postSchema>
    label: string
    lookup: Record<string, string>
    placeholder?: string
  }) => {
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
                      !field.value &&
                        'text-muted-foreground',
                    )}
                  >
                    {lookup[field.value] ?? placeholder}
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
                            form.setValue(name, value)
                          }}
                        >
                          {lookup[key]}
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

  const LocationField = ({
    name = 'location',
    label = 'Location',
    placeholder,
  }: {
    name?: keyof z.infer<typeof postSchema>
    label?: string
    placeholder?: string
  }) => {
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
                      !field.value &&
                        'text-muted-foreground',
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

  return (
    <Card className='flex w-full flex-col md:min-w-3xl md:flex-row'>
      <div className='flex-1'>
        <CardHeader>
          <CardTitle className='text-2xl'>
            Post Your Ad
          </CardTitle>
          <CardDescription>
            Fill out the form below to post your ad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-4'>
                <InputField
                  name='name'
                  label='Name'
                  placeholder='Enter the item name, e.g., AMD RYZEN 7 7800X3D'
                />
                <InputField
                  name='description'
                  label='Description'
                  placeholder='Provide details about the item, such as size or material'
                />
                <InputField
                  name='price'
                  label='Price'
                  placeholder='Enter the price in AUD, e.g., 150.00'
                />
                <InputField
                  name='image_url'
                  label='Image URL'
                  placeholder='Paste a valid image link, e.g., https://example.com/image.jpg'
                />
                <DropdownField
                  name='category'
                  label='Category'
                  placeholder='Select an item category'
                  lookup={CATEGORIES}
                />
                <DropdownField
                  name='condition'
                  label='Condition'
                  placeholder='Choose the condition, e.g., New or Used'
                  lookup={CONDITIONS}
                />
                <LocationField placeholder='Search for a location, e.g., Sydney' />

                <Button type='submit' className='w-full'>
                  Post Ad
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
      <div className='flex flex-1 items-center justify-center bg-muted italic max-md:h-52'>
        No image
      </div>
    </Card>
  )
}
