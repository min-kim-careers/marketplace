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
import { Form } from '@/components/shadcn/components/ui/form'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { ROUTES } from '@/lib/constants/routes'
import useAuthStore from '@/lib/stores/auth'
import { useRouter } from 'next/navigation'
import {
  CategoryField,
  ConditionField,
  DescriptionField,
  ImageField,
  LocationField,
  NameField,
  PriceField,
} from '@/components/02_main/protected/item/post/form/fields'
import ImagePreview from './image-preview'
import { ItemPostFormSchema } from '@/components/02_main/protected/item/post/form'

export default function ItemPost() {
  const { profile } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof ItemPostFormSchema>>({
    resolver: zodResolver(ItemPostFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      location: '',
      condition: '',
      expires_in: 0,
      image_urls: Array.from({ length: 3 }, () => ''),
    },
  })

  async function onSubmit(
    values: z.infer<typeof ItemPostFormSchema>,
  ) {

    router.push(ROUTES.MARKET)
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
              <div className='flex flex-col gap-4'>
                <ImageField form={form} />

                <NameField form={form} />
                <PriceField form={form} />
                <DescriptionField form={form} />
                <ConditionField form={form} />
                <CategoryField form={form} />
                <LocationField form={form} />

                <Button
                  type='submit'
                  className='mt-4 w-full'
                >
                  Post Ad
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
      <div className='flex flex-1 items-center justify-center bg-muted'>
        <ImagePreview form={form} />
      </div>
    </Card>
  )
}
