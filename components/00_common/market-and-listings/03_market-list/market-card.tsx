import ImageContainer from '@/components/00_common/image-container'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { formatItemDate } from '@/lib/helpers/format-item-date'
import { formatCurrency } from '@/lib/helpers/format-price'
import { Item } from '@/lib/types/item'

export default function MarketCard({
  item,
  columns,
}: {
  item: Item
  columns: number
}) {
  const renderCardImage = () => {
    if (!item.imageUrls[0]) return null

    return (
      <div className='relative m-2 flex flex-1 rounded bg-gray-100 p-2'>
        <ImageContainer url={item.imageUrls[0]} />
        {item.imageUrls.length > 1 && (
          <p className='absolute bottom-0 right-0 z-10 m-2 flex justify-end rounded bg-white px-1 py-[0.5]'>
            +{item.imageUrls.length - 1}
          </p>
        )}
      </div>
    )
  }

  return (
    <Card
      className='flex h-60 w-full flex-row justify-between transition-transform duration-300 hover:scale-[1.01]'
      style={{
        minHeight: columns === 1 ? '12rem' : '15rem',
      }}
    >
      <div className='flex flex-1 flex-col justify-between'>
        <CardHeader className='flex-1'>
          <CardTitle className='line-clamp-1 space-x-2'>
            <span>{item.name}</span>
            <span className='font-normal'>{`${item.suburb}, ${item.postcode}`}</span>
          </CardTitle>
          <CardDescription className='line-clamp-1'>
            <div className='flex gap-1'>
              <span>{`${formatItemDate(item.createdAt)} by `}</span>
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
          {formatCurrency(item.price.toString())}
        </CardFooter>
      </div>
      {columns === 1 && (
        <div className='flex min-w-3xs sm:min-w-xs'>
          {renderCardImage()}
        </div>
      )}
    </Card>
  )
}
