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
import { ITEM_STATUS_COLORS } from '@/lib/constants/item-status-colors'
import { formatCurrency } from '@/lib/helpers/format-price'
import useLayoutStore from '@/lib/stores/layout-store'
import { Item } from '@/lib/types/item'
import { Circle } from 'lucide-react'

export default function ProfileListingsCard({
  item,
  columns,
}: {
  item: Item
  columns: number
}) {
  const { itemColumns } = useLayoutStore()

  return (
    <Card
      className='flex h-60 w-full flex-row justify-between transition-transform duration-300 hover:scale-[1.01]'
      style={{
        minHeight: columns === 1 ? '12rem' : '15rem',
      }}
    >
      <div className='flex flex-1 flex-col justify-between'>
        <CardHeader className='flex-1'>
          <CardTitle className='line-clamp-1 flex items-center space-x-2'>
            <span>
              <Circle fill={ITEM_STATUS_COLORS[item.status]} size={8} />
            </span>
            <span className='font-thin italic text-gray-400'>Listing</span>
            <span>{item.name}</span>
            <span className='font-normal'>{`${item.suburb}, ${item.postcode}`}</span>
          </CardTitle>
          <CardDescription className='line-clamp-1'>
            <div className='flex gap-1'>
              <span>
                Posted <DateFormatter date={item.createdAt} />
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
