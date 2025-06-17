'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  createItem,
  deleteItem,
  uploadImages,
} from '@/_gateway/api/item/service'
import ItemImagePreview from '@/components/02_main/market/00_common/item-image-preview'
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
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useRouter } from 'next/navigation'

export default function ItemPost({
  imageLimit,
}: {
  imageLimit: number
}) {
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
      images: Array.from(
        { length: imageLimit },
        () => null,
      ),
    },
  })

  const imagesWatcher = form.watch('images')

  async function onSubmit(
    values: z.infer<typeof ItemPostFormSchema>,
  ) {
    try {
      const request = {
        ...values,
        postcode: values.location,
      }

      const item = await createItem(request)
      if (!item) throw new Error('Failed to create item')

      const images = values.images.filter(
        (img) => img instanceof File,
      )

      const itemWithImages = await uploadImages(
        item.id,
        images,
      )
      if (!itemWithImages) {
        await deleteItem(item.id)
        throw new Error('Failed to upload item images')
      }

      toast({
        description:
          'Your item has been successfully posted!',
      })
      router.push(APP_ROUTES.MARKET.url)
    } catch (error) {
      toast({
        description: 'Something went wrong',
      })
    }
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
          imageUrls={imagesWatcher
            .filter((img) => img !== null)
            .map((img) => URL.createObjectURL(img))}
        />
      </div>
    </Card>
  )
}

