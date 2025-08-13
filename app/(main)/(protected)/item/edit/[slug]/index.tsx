'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ItemFormSchema } from '@/components/item-form/schema'
import {
  CategoryField,
  ConditionField,
  DescriptionField,
  ImageField,
  LocationField,
  NameField,
  PriceField,
} from '@/components/item-form/fields'
import ItemImagePreview from '@/components/item-image-preview'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Form } from '@/components/shadcn/components/ui/form'
import { useItemHandler } from '@/lib/hooks/use-item-handler'
import { Item } from '@/lib/types/item'
import { toast } from 'sonner'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { _UpsertItemRequest } from '@/api/endpoints/item'
import { useRouter } from 'next/navigation'

export default function ItemEdit({
  item,
  imageLimit,
}: {
  item: Item
  imageLimit: number
}) {
  const { handleUpsert } = useItemHandler()
  const router = useRouter()

  const initImageUrls = () =>
    Array.from({ length: imageLimit }, (_, i) =>
      i < item.imageUrls.length ? item.imageUrls[i] : null,
    )

  const form = useForm<z.infer<typeof ItemFormSchema>>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: {
      ...item,
      location: {
        postcode: item.postcode,
        state: item.state,
        suburb: item.suburb,
      },
      imageUrls: initImageUrls(),
    },
  })

  const formWasUpdated = (values: z.infer<typeof ItemFormSchema>) => {
    const conditions = [
      item.name === values.name,
      item.description === values.description,
      item.price === values.price,
      item.category === values.category,
      item.condition === values.condition,
      item.postcode === values.location.postcode,
      item.suburb === values.location.suburb,
      item.state === values.location.state,
      item.imageUrls.every((url, i) => url === values.imageUrls[i]),
    ]

    return conditions.some((condition: boolean) => !condition)
  }

  async function onSubmit(values: z.infer<typeof ItemFormSchema>) {
    if (!item.id) throw new Error('missing item id')

    if (!formWasUpdated(values)) {
      toast('Please make a change before submitting.')
      return
    }

    const { location, imageUrls, ..._values } = values

    const request: _UpsertItemRequest = {
      ..._values,
      ...location,
      imageUrls: imageUrls.filter((u) => u !== null),
    }

    if (await handleUpsert(request, item.id)) {
      router.replace(APP_ROUTES.PROFILE_LISTINGS.href)
    }
  }

  return (
    <Card className='flex w-full flex-col md:min-w-3xl md:flex-row'>
      <div className='flex-1'>
        <CardHeader className='pb-4'>
          <CardTitle className='text-2xl'>Edit your Ad</CardTitle>
          <CardDescription>
            Fill out the form below to edit your ad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-4'>
                {!!imageLimit && <ImageField form={form} />}

                <NameField form={form} />
                <PriceField form={form} />
                <DescriptionField form={form} />
                <ConditionField form={form} />
                <CategoryField form={form} />
                <LocationField form={form} />

                <Button type='submit' className='mt-4 w-full'>
                  Edit Ad
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
      <div className='flex flex-1 items-center justify-center rounded-xl bg-muted'>
        <ItemImagePreview
          imageUrls={form
            .watch('imageUrls')
            .filter((v) => v != null)
            .map((v) => v)}
        />
      </div>
    </Card>
  )
}
