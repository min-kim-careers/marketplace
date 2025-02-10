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
import { ROUTES } from '@/constants/routes'
import { insertItem } from '@/lib/supabase/items/actions'
import useAuthStore from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import {
  CategoryField,
  ConditionField,
  DescriptionField,
  ImageField,
  LocationField,
  NameField,
  PriceField,
} from './fields'
import { PostFormSchema } from './schema'
import { useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shadcn/components/ui/carousel'
import Image from 'next/image'

export default function Post() {
  const { profile } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof PostFormSchema>>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      location: '',
      condition: '',
      expires_in: 0,
      image_urls: [],
    },
  })

  async function onSubmit(
    values: z.infer<typeof PostFormSchema>,
  ) {
    await insertItem(values, profile)

    router.push(ROUTES.SEARCH)
    toast({
      description:
        'Your item has been posted successfully!',
    })
  }

  const [imageUrls, setImageUrls] = useState<string[]>(
    Array.from({ length: 3 }, () => ''),
  )

  const renderImageFields = () => {
    return (
      <ImageField
        form={form}
        imageUrls={imageUrls}
        setImageUrls={setImageUrls}
      />
    )
  }

  const renderImagePreviews = () => {
    return (
      <Carousel className='w-full bg-black'>
        <CarouselContent>
          {imageUrls.map((_, index) => (
            <CarouselItem key={index}>
              <div className='flex aspect-square items-center justify-center'>
                {imageUrls[index] ? (
                  <Image
                    src={imageUrls[index]}
                    alt='preview-image'
                    layout='fill'
                    objectFit='contain'
                  />
                ) : (
                  '+'
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
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
                {renderImageFields()}

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
        {renderImagePreviews()}
      </div>
    </Card>
  )
}
