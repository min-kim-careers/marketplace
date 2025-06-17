import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shadcn/components/ui/carousel'
import Image from 'next/image'

export default function ItemImagePreview({
  imageUrls,
}: {
  imageUrls: string[]
}) {
  if (!imageUrls.length) return null

  return (
    <Carousel className='flex-1'>
      <CarouselContent className='m-0'>
        {imageUrls.map(
          (url, index) =>
            url && (
              <CarouselItem
                key={index}
                className='relative aspect-square bg-gray-100'
              >
                <Image
                  src={url}
                  alt='preview-image'
                  layout='fill'
                  objectFit='contain'
                  className='rounded'
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
