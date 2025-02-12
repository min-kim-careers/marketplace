import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/shadcn/components/ui/carousel'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { PostFormSchema } from './schema'
import { CircleSlash2 } from 'lucide-react'

export default function Preview({
  form,
}: {
  form: UseFormReturn<z.infer<typeof PostFormSchema>>
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const watchField = form.watch('image_urls')

  useEffect(() => {
    if (!api) {
      return
    }

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  useEffect(() => {
    const newFields = watchField!.filter((field) => field)
    setCount(newFields.length)
    setCurrent(1)
  }, [watchField])

  if (!count) return <CircleSlash2 size={48} className='text-gray-300'/>

  return (
    <Carousel
      setApi={setApi}
      className='relative m-0 flex-1'
    >
      <CarouselContent className='m-0'>
        {form.getValues().image_urls!.map(
          (url, index) =>
            url && (
              <CarouselItem
                key={index}
                className='relative m-0 flex aspect-square'
              >
                <Image
                  src={url}
                  alt='preview-image'
                  layout='fill'
                  objectFit='contain'
                />
              </CarouselItem>
            ),
        )}
      </CarouselContent>
      {count > 0 && current > 1 && (
        <CarouselPrevious className='left-2' />
      )}
      {count > 1 && current < count && (
        <CarouselNext className='right-2' />
      )}
    </Carousel>
  )
}
