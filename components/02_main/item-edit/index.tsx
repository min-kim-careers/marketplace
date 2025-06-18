'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ItemEditFormSchema } from '@/components/02_main/item-edit/form'
import {
  CategoryField,
  ConditionField,
  DescriptionField,
  ImageField,
  LocationField,
  NameField,
  PriceField,
} from '@/components/02_main/item-edit/form/fields'
import ItemImagePreview from '@/components/02_main/market/00_common/item-image-preview'
import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Form } from '@/components/shadcn/components/ui/form'
import { useUpdateItem } from '@/lib/hooks/item/use-update-item'
import { Item } from '@/lib/interfaces/item'

export default function ItemEdit({
  item,
  imageLimit,
}: {
  item: Item
  imageLimit: number
}) {
  const { handleUpdateItem } = useUpdateItem()

  const initImageUrls = () =>
    Array.from({ length: imageLimit }, (_, i) =>
      i < item.imageUrls.length ? item.imageUrls[i] : null,
    )

  const form = useForm<z.infer<typeof ItemEditFormSchema>>({
    resolver: zodResolver(ItemEditFormSchema),
    defaultValues: {
      ...item,
      imageUrls: initImageUrls(),
    },
  })

  async function onSubmit(
    values: z.infer<typeof ItemEditFormSchema>,
  ) {
    const request = {
      ...values,
      postcode: values.location,
    }
    
    await handleUpdateItem({
      itemId: item.id,
      request,
      imageUrls: values.imageUrls.filter((v) => v !== null),
    })
  }

  return (
    <Card className='flex w-full flex-col md:min-w-3xl md:flex-row'>
      <div className='flex-1'>
        <CardHeader className='pb-4'>
          <CardTitle className='text-2xl'>
            Edit your Ad
          </CardTitle>
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

                <Button
                  type='submit'
                  className='mt-4 w-full'
                >
                  Edit Ad
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
