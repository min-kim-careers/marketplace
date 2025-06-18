'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ItemPostFormSchema } from '@/components/02_main/item-post/form'
import {
  CategoryField,
  ConditionField,
  DescriptionField,
  ImageField,
  LocationField,
  NameField,
  PriceField,
} from '@/components/02_main/item-post/form/fields'
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
import { useCreateItem } from '@/lib/hooks/item/use-create-item'

export default function ItemPost({
  imageLimit,
}: {
  imageLimit: number
}) {
  const { handleCreateItem } = useCreateItem()

  const initImageUrls = () =>
    Array.from({ length: imageLimit }, () => null)

  const form = useForm<z.infer<typeof ItemPostFormSchema>>({
    resolver: zodResolver(ItemPostFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      location: '',
      condition: '',
      imageUrls: initImageUrls(),
    },
  })

  async function onSubmit(
    values: z.infer<typeof ItemPostFormSchema>,
  ) {
    const request = {
      ...values,
      postcode: values.location,
    }

    await handleCreateItem({
      request,
      imageUrls: values.imageUrls.filter((v) => v !== null),
    })
  }

  return (
    <Card className='flex w-full flex-col md:min-w-3xl md:flex-row'>
      <div className='flex-1'>
        <CardHeader className='pb-4'>
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
