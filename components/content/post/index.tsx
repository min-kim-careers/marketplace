'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Control, useForm } from 'react-hook-form'
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shadcn/components/ui/form'
import { Input } from '@/components/shadcn/components/ui/input'
import { postSchema } from './schema'
import { insertItem } from '@/utils/supabase/crud/item'
import { Item } from '@/utils/supabase/types/item'
import useAuthStore from '@/store/auth-store'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants/routes'

function Field({
  name,
  label,
  placeholder,
  control,
  description,
}: {
  name: keyof z.infer<typeof postSchema>
  label: string
  placeholder: string
  control: Control<z.infer<typeof postSchema>>
  description?: string
}) {
  return (
    <FormField
      control={control}
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

export default function Post() {
  const { profile } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    // defaultValues: {
    //   name: '',
    //   description: '',
    //   price: 0,
    //   image_url: '',
    //   category: '',
    //   suburb: '',
    //   state: '',
    //   condition: '',
    // },
    defaultValues: {
      name: 'Sample Item',
      description: 'This is a sample item description.',
      price: 100,
      image_url: 'https://via.placeholder.com/150',
      category: 'Electronics',
      suburb: 'Sample Suburb',
      state: 'Sample State',
      condition: 'New',
    },
  })

  async function onSubmit(
    values: z.infer<typeof postSchema>,
  ) {
    await insertItem({
      ...values,
      created_at: new Date(),
      updated_at: new Date(),
      user_handle: profile?.handle,
      user_email: profile?.email,
    } as Item)

    router.push(ROUTES.SEARCH)
    toast({
      description:
        'Your item has been posted successfully!',
    })
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
                <Field
                  name='name'
                  label='Name'
                  placeholder='Enter your name'
                  control={form.control}
                />
                <Field
                  name='description'
                  label='Description'
                  placeholder='Enter a description'
                  control={form.control}
                />
                <Field
                  name='price'
                  label='Price'
                  placeholder='Enter the price'
                  control={form.control}
                />
                <Field
                  name='image_url'
                  label='Image URL'
                  placeholder='Enter the image URL'
                  control={form.control}
                />
                <Field
                  name='category'
                  label='Category'
                  placeholder='Enter the category'
                  control={form.control}
                />
                <Field
                  name='suburb'
                  label='Suburb'
                  placeholder='Enter the suburb'
                  control={form.control}
                />
                <Field
                  name='state'
                  label='State'
                  placeholder='Enter the state'
                  control={form.control}
                />
                <Field
                  name='condition'
                  label='Condition'
                  placeholder='Enter the condition'
                  control={form.control}
                />
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
