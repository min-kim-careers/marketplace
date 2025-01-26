import { Button } from '@/app/components/shadcn/components/ui/button'
import {
  Card
} from '@/app/components/shadcn/components/ui/card'
import { Input } from '@/app/components/shadcn/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/shadcn/components/ui/select'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/app/components/shadcn/components/ui/toggle-group'
import { Grip, Menu, Search } from 'lucide-react'

export default function Toolbar({
  setColumns,
  defaultColumns,
}: {
  setColumns: (value: number) => void
  defaultColumns: number
}) {
  return (
    <Card className='flex h-full items-center justify-between p-2'>
      <span className='hidden gap-2 sm:flex'>
        <ToggleGroup
          type='single'
          onValueChange={(value) => setColumns(+value)}
          defaultValue={defaultColumns.toString()}
        >
          <ToggleGroupItem value='1'>
            <Menu />
          </ToggleGroupItem>
          <ToggleGroupItem value='3'>
            <Grip />
          </ToggleGroupItem>
        </ToggleGroup>
      </span>
      <span className='flex w-1/3 gap-2'>
        <Input placeholder='Search' />
        <Button>
          <Search />
        </Button>
      </span>
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
  )
}
