import ImageContainer from '@/components/image-container'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/shadcn/components/ui/carousel'

export default function ItemImageCarousel({
  imageUrls,
  className,
}: {
  imageUrls: string[]
  className?: string
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
                className='relative aspect-square rounded bg-gray-100'
              >
                <ImageContainer url={url} className={className} />
              </CarouselItem>
            ),
        )}
      </CarouselContent>
      <CarouselPrevious className='left-2' />
      <CarouselNext className='right-2' />
    </Carousel>
  )
}
