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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Check, ChevronsUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { postSchema } from './schema'
import { LOCATIONS } from '@/constants/locations'
import { CATEGORIES } from '@/constants/categories'
import { CONDITIONS } from '@/constants/conditions'

export default function Post() {
  // const { profile } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image_url: '',
      category: '',
      location: '',
      condition: '',
    },
    // defaultValues: {
    //   name: 'Sample Item',
    //   description: 'This is a sample item description.',
    //   price: 100,
    //   image_url: 'https://via.placeholder.com/150',
    //   category: 'Electronics',
    //   suburb: 'Sample Suburb',
    //   state: 'Sample State',
    //   condition: 'New',
    // },
  })

  async function onSubmit(
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

  const renderInputField = (
    name: keyof z.infer<typeof postSchema>,
    label: string,
    placeholder: string,
    description?: string,
  ) => {
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
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  const renderSuggestionField = (
    name: keyof z.infer<typeof postSchema>,
    label: string,
    placeholder: string,
    suggestions: Record<string, string>,
    description?: string,
  ) => {
    const handleSearch = (value: string, search:string) => value.startsWith(search) ? 1 : 0

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
                    {suggestions[field.value] ??
                      placeholder}
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
                      {Object.keys(suggestions).map(
                        (key) => (
                          <CommandItem
                            value={key}
                            key={key}
                            onSelect={(value) => {
                              form.setValue(name, value)
                            }}
                          >
                            {suggestions[key]}
                            <Check
                              className={cn(
                                'ml-auto',
                                key === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                          </CommandItem>
                        ),
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>{description}</FormDescription>
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
              <div className='flex flex-col gap-2'>
                {renderInputField(
                  'name',
                  'Name',
                  'Enter your name',
                )}
                {renderInputField(
                  'description',
                  'Description',
                  'Enter a description',
                )}
                {renderInputField(
                  'price',
                  'Price',
                  'Enter the price',
                )}
                {renderInputField(
                  'image_url',
                  'Image URL',
                  'Enter the image URL',
                )}
                {renderSuggestionField(
                  'category',
                  'Category',
                  'Select category',
                  CATEGORIES,
                )}
                {renderSuggestionField(
                  'condition',
                  'Condition',
                  'Select condition',
                  CONDITIONS,
                )}
                {renderSuggestionField(
                  'location',
                  'Location',
                  'Select location',
                  LOCATIONS,
                )}

                <Button type='submit' className='w-full'>
                  Post Ad
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
      <div className='flex flex-1 items-center justify-center bg-muted italic'>
        No image
      </div>
    </Card>
  )
}
