import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Item } from '@/utils/supabase/types/item'

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
            <div className='flex justify-between'>
              <p>User: {item.user_handle}</p>
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
          <p className='text-gray-400 italic'>No image</p>
        </div>
      )}
    </Card>
  )
}
