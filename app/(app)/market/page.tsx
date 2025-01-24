'use client'

import SearchBar from '@/components/search'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
// import { getItems } from '@/utils/supabase/crud/item'
import { Item } from '@/utils/supabase/types/item'
import { useEffect, useState } from 'react'
import jsonData from '@/data/items.json'

export default function MarketPage() {
  const [columns, setColumns] = useState(3)
  const [items, setItems] = useState<Item[]>(
    jsonData.map((data) => ({
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    })),
  )

  // useEffect(() => {
  //   async function fetchItems() {
  //     const items: Item[] = await getItems()
  //     if (items) setItems(items)
  //     console.log(items)
  //   }
  //   fetchItems()
  // }, [])

  return (
    <div className='flex min-w-full flex-col gap-4 p-4'>
      <SearchBar setColumns={setColumns} />
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
                  {/* <p>{item.createdAt.toISOString()}</p> */}
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
