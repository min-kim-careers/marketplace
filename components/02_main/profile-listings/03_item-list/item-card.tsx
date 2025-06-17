import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
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
  const createdAt = () =>
    formatDistanceToNow(item.createdAt.toLocaleString(), {
      addSuffix: true,
    })

  const renderCardImage = () => (
    <div className='flex aspect-video w-80'>
      <div className='relative m-2 flex flex-1 rounded bg-gray-100 p-2 shadow'>
        <Image
          alt='preview'
          src={item.imageUrls[0]}
          layout='fill'
          objectFit='contain'
          className='rounded'
        />
        {item.imageUrls.length > 1 && (
          <p className='absolute bottom-0 right-0 z-10 m-2 flex justify-end rounded bg-white px-1 py-[0.5] shadow'>
            +{item.imageUrls.length - 1}
          </p>
        )}
      </div>
    </div>
  )

  return (
    <Card
      className='h-30 flex w-full flex-row justify-between'
      style={{
        minHeight: columns === 1 ? '12rem' : '15rem',
      }}
    >
      <div className='flex-1'>
        <CardHeader className='flex-1'>
          <CardTitle>
            <div className='line-clamp-1 space-x-2'>
              <span className='font-thin italic text-gray-400'>
                Listing
              </span>
              <span>{item.name}</span>
              {item.brand && (
                <span className='font-normal'>{`- ${item.brand}`}</span>
              )}
            </div>
          </CardTitle>
          <CardDescription className='line-clamp-1'>
            <div className='flex gap-1'>
              <span>{`Posted ${createdAt()} `}</span>
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
      {columns === 1 &&
        !!item.imageUrls.length &&
        renderCardImage()}
    </Card>
  )
}
