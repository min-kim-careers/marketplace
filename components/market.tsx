'use client'

import Pagination from '@/components/pagination'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import Toolbar from '@/components/toolbar'
// import { getItems } from '@/utils/supabase/crud/item'
import useMarketStore from '@/store/market-store'
import { Item } from '@/utils/supabase/types/item'
import { useState } from 'react'

export default function Market({
  page,
  limit,
}: {
  page: number
  limit: number
}) {
  const [columns, setColumns] = useState(1)
  const { items } = useMarketStore()

  return (
    <div className='flex min-w-full flex-col gap-2 p-4'>
      <Toolbar
        setColumns={setColumns}
        defaultColumns={columns}
      />
      <div className='flex justify-end px-2 text-sm'>
        {items.length} items found
      </div>
      <div
        className='grid flex-1 items-start gap-4'
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {items.map((item: Item, i) => (
          <Card
            key={i}
            className='flex h-full w-full flex-col'
          >
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
          </Card>
        ))}
        <Pagination page={page} limit={limit} />
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          div.grid {
            grid-template-columns: repeat(
              1,
              1fr
            ) !important;
          }
        }
      `}</style>
    </div>
  )
}
