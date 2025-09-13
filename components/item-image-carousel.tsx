import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shadcn/components/ui/carousel'
import { cn } from '@/components/shadcn/lib/utils'
import Image from 'next/image'

export default function ItemImageCarousel({
  imageUrls,
  rounded = false,
}: {
  imageUrls: string[]
  rounded?: boolean
}) {
  if (!imageUrls.length) return null

  return (
    <Carousel className='flex-1 rounded'>
      <CarouselContent className='m-0 rounded'>
        {imageUrls.map(
          (url, index) =>
            url && (
              <CarouselItem key={index} className='relative aspect-square'>
                <Image
                  src={url}
                  alt='Failed to load'
                  fill
                  className={cn('object-contain', rounded ? 'rounded-xl' : '')}
                />
              </CarouselItem>
            ),
        )}
      </CarouselContent>
      <CarouselPrevious className='left-2' />
      <CarouselNext className='right-2' />
    </Carousel>
  )
}
