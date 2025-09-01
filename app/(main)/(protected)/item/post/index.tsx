'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { _UpsertItemQuery } from '@/api/endpoints/item'
import {
  CategoryField,
  ConditionField,
  DescriptionField,
  ImageField,
  LocationField,
  NameField,
  PriceField,
} from '@/components/item-form/fields'
import { ItemFormSchema } from '@/components/item-form/schema'
import ItemImageCarousel from '@/components/item-image-carousel'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Form } from '@/components/shadcn/components/ui/form'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useItemHandler } from '@/lib/hooks/use-item-handler'
import { useRouter } from 'next/navigation'

interface ItemPostProps {
  imageLimit: number
}

export default function ItemPost({ props }: { props: ItemPostProps }) {
  const { handleUpsert } = useItemHandler()
  const router = useRouter()

  const form = useForm<z.infer<typeof ItemFormSchema>>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      location: { postcode: '', state: '', suburb: '' },
      condition: '',
      imageUrls: Array(props.imageLimit).fill(null),
    },
  })

  async function onSubmit(values: z.infer<typeof ItemFormSchema>) {
    const { location, imageUrls, ..._values } = values

    const request: _UpsertItemQuery = {
      ..._values,
      ...location,
      imageUrls: imageUrls.filter((u) => u !== null),
    }

    if (await handleUpsert(request)) {
      router.replace(APP_ROUTES.PROFILE_LISTINGS.href)
    }
  }

  return (
    <div className='flex w-full flex-1 flex-col justify-center'>
      <Card className='flex w-full flex-col md:min-w-3xl md:flex-row'>
        <div className='flex-1'>
          <CardHeader className='pb-4'>
            <CardTitle className='text-2xl'>Post your Ad</CardTitle>
            <CardDescription>
              Fill out the form below to post your ad.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-4'>
                  {props.imageLimit > 0 && <ImageField form={form} />}
                  <NameField form={form} />
                  <PriceField form={form} />
                  <DescriptionField form={form} />
                  <ConditionField form={form} />
                  <CategoryField form={form} />
                  <LocationField form={form} />
                  <Button type='submit' className='mt-4 w-full'>
                    Post Ad
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </div>
        <div className='flex flex-1 items-center justify-center bg-muted'>
          <ItemImageCarousel
            imageUrls={form
              .watch('imageUrls')
              .filter((v) => v != null)
              .map((v) => v)}
          />
        </div>
      </Card>
    </div>
  )
}
