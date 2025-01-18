'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/components/ui/card'
import { Input } from '@/components/shadcn/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/components/ui/select'
import { Separator } from '@/components/shadcn/components/ui/separator'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/shadcn/components/ui/toggle-group'
import itemJson from '@/data/items.json'
import { Item } from '@/utils/supabase/types/item'
import { Grip, Menu, Search } from 'lucide-react'
import { useState } from 'react'

export default function MarketPage() {
  const [columns, setColumns] = useState(3)

  const items: Item[] = itemJson.map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
  }))

  return (
    <div className='flex min-w-full flex-col gap-4 p-4'>
      <Card className='flex items-center justify-evenly p-2'>
        <span className='flex gap-2 w-1/3'>
          <Input placeholder='Search' />
          <Button>
            <Search />
          </Button>
        </span>
        <Separator orientation='vertical' className='h-6' />
        <span className='hidden gap-2 sm:flex'>
          <ToggleGroup
            type='single'
            onValueChange={(value) => setColumns(+value)}
            defaultValue='3'
          >
            <ToggleGroupItem value='1'>
              <Menu />
            </ToggleGroupItem>
            <ToggleGroupItem value='3'>
              <Grip />
            </ToggleGroupItem>
          </ToggleGroup>
        </span>
        <Separator orientation='vertical' className='h-6' />
        <span>
          <Select>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Sorted by' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='price'>Price</SelectItem>
                <SelectItem value='createdAt'>
                  Date
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </span>
      </Card>
      <div
        className='grid flex-1 items-start gap-4'
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {items.map((item) => (
          <Card
            key={item.id}
            className='flex h-full w-full flex-col'
          >
            <CardHeader className='flex-1'>
              <CardTitle className='line-clamp-1'>
                {item.name}
              </CardTitle>
              <CardDescription className='line-clamp-1'>
                <div className='flex justify-between'>
                  <p>User: {item.userHandle}</p>
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
