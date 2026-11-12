import DateFormatter from '@/components/date-formatter'
import CardImage from '@/components/item-list/00_common/card-image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { formatCurrency } from '@/lib/helpers/format-price'
import { Item } from '@/lib/types/item'

export default function MarketCard({
  item,
  itemColumns,
}: {
  item: Item
  itemColumns: number
}) {
  return (
    <Card
      className='flex h-60 w-full flex-row justify-between transition-transform duration-300 hover:scale-[1.01]'
      style={{
        minHeight: itemColumns === 1 ? '12rem' : '15rem',
      }}
    >
      <div className='flex flex-1 flex-col justify-between'>
        <CardHeader className='flex-1'>
          <CardTitle className='line-clamp-1 space-x-2'>
            <span>{item.name}</span>
            <span className='font-normal'>-</span>
            <span className='font-normal'>{`${item.suburb}, ${item.postcode}`}</span>
          </CardTitle>
          <CardDescription className='line-clamp-1'>
            <div className='flex gap-1'>
              <span>
                Posted <DateFormatter date={item.createdAt} /> by{' '}
                <button className='font-semibold'>{item.profile.handle}</button>
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className='flex-[2]'>
          <p className='line-clamp-2'>{item.description}</p>
        </CardContent>

        <CardFooter className='line-clamp-1 flex-1'>
          {formatCurrency(item.price.toString())}
        </CardFooter>
      </div>

      <CardImage imageUrls={item.imageUrls} show={itemColumns === 1} />
    </Card>
  )
}
