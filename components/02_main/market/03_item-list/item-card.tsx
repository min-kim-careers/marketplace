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

  const renderCardImage = () => {
    if (!item.imageUrls[0]) return null

    return (
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
    )
  }

  return (
    <Card
      className='flex h-60 w-full flex-row justify-between'
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
              <span>{`${createdAt()} by `}</span>
              <span>
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
        <div className='flex flex-[0.5]'>
          {renderCardImage()}
        </div>
      )}
    </Card>
  )
}
