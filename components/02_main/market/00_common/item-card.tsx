import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/shadcn/components/ui/carousel'
import { Item } from '@/lib/interfaces/item'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'

export default function ItemCard({
  item,
  columns,
}: {
  item: Item
  columns: number
}) {
  return (
    <Card
      className='flex min-w-full flex-row justify-between'
      style={{
        minHeight: columns === 1 ? '12rem' : '15rem',
      }}
    >
      <div className='flex-1'>
        <CardHeader className='flex-1'>
          <CardTitle className='line-clamp-1'>
            {item.name}
          </CardTitle>
          <CardDescription className='line-clamp-1'>
            <div className='flex gap-1'>
              {formatDistanceToNow(
                item.createdAt.toLocaleString(),
                { addSuffix: true },
              )}{' '}
              by{' '}
              <span className='space-x-2'>
                <button className='font-semibold'>
                  {item.profileHandle}
                </button>
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className='line-clamp-3 flex-[2]'>
          <p>{item.description}</p>
        </CardContent>
        <CardFooter className='line-clamp-1 flex-1'>
          ${item.price}
        </CardFooter>
      </div>
      {columns === 1 && (
        <div className='m-2 flex min-h-full flex-[0.5] items-center justify-center rounded shadow'>
          <Carousel>
            <CarouselContent>
              {item.imageUrls.map((url, index) => (
                <CarouselItem
                  key={index}
                  className='flex aspect-square justify-center'
                >
                  <img
                    src={url}
                    alt='preview-image'
                    className='object-fill rounded'
                    // layout='fill'
                    // objectFit='contain'
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </Card>
  )
}
