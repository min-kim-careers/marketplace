'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { UpsertItemRequest } from '@/_gateway/api/item/service'
import ItemImagePreview from '@/components/00_common/item-image-preview'
import { ItemFormSchema } from '@/components/00_common/item-form/schema'
import {
  CategoryField,
  ConditionField,
  DescriptionField,
  ImageField,
  LocationField,
  NameField,
  PriceField,
} from '@/components/00_common/item-form/fields'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Form } from '@/components/shadcn/components/ui/form'
import { useUpsertItem } from '@/lib/hooks/use-upsert-item'
import { APP_ROUTES } from '@/lib/constants/app-routes'

export default function ItemPost({
  imageLimit,
}: {
  imageLimit: number
}) {
  const { handleUpsertItem: handleUpdateItem } =
    useUpsertItem()

  const initImageUrls = () =>
    Array.from({ length: imageLimit }, (_, i) => null)

  const form = useForm<z.infer<typeof ItemFormSchema>>({
    resolver: zodResolver(ItemFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      location: {},
      condition: '',
      imageUrls: initImageUrls(),
    },
  })

  async function onSubmit(
    values: z.infer<typeof ItemFormSchema>,
  ) {
    const { location, imageUrls, ..._values } = values

    const request: UpsertItemRequest = {
      ..._values,
      ...location,
      imageUrls: imageUrls.filter((u) => u !== null),
    }

    await handleUpdateItem(
      request,
      undefined,
      APP_ROUTES.PROFILE_LISTINGS.href,
    )
  }

  return (
    <Card className='flex w-full flex-col md:min-w-3xl md:flex-row'>
      <div className='flex-1'>
        <CardHeader className='pb-4'>
          <CardTitle className='text-2xl'>
            Post your Ad
          </CardTitle>
          <CardDescription>
            Fill out the form below to post your ad.
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
