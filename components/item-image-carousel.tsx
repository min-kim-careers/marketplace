import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shadcn/components/ui/carousel'
import Image from 'next/image'

export default function ItemImageCarousel({
  imageUrls,
  className,
  size,
}: {
  imageUrls: string[]
  className?: string
  size?: number
}) {
  if (!imageUrls.length) return null

  return (
    <Carousel className='flex-1 rounded'>
      <CarouselContent className='m-0 rounded'>
        {imageUrls.map(
          (url, index) =>
            url && (
              <CarouselItem
                key={index}
                className='relative flex items-center justify-center rounded-lg bg-gray-100'
              >
                <div className={`relative h-[${size}rem] w-[${size}rem] `}>
                  <Image src={url} alt='Failed to load' fill />
                </div>
              </CarouselItem>
            ),
        )}
      </CarouselContent>
      <CarouselPrevious className='left-2' />
      <CarouselNext className='right-2' />
    </Carousel>
  )
}
