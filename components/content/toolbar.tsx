import { Button } from '@/components/shadcn/components/ui/button'
import { Card } from '@/components/shadcn/components/ui/card'
import { Input } from '@/components/shadcn/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/components/ui/select'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/shadcn/components/ui/toggle-group'
import { ROUTES } from '@/constants/routes'
import {
  extractParams,
  paramsToQuery,
} from '@/helpers/params'
import useRouter from '@/hooks/use-router'
import type { SortOrder } from '@/types/params'
import { Grip, Menu, Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { ChangeEvent, useState } from 'react'

export default function Toolbar({
  setColumns,
  defaultColumns,
}: {
  setColumns: (value: number) => void
  defaultColumns: number
}) {
  const searchParams = useSearchParams()
  const params = extractParams(searchParams)
  const router = useRouter()

  const viewToggle = () => (
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
  )

  const [searchValue, setSearchValue] = useState('')

  const handleSearchValueChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchValue(e.target.value)
  }

  const handleSearch = async () => {
    const query = paramsToQuery({
      page: 1,
      keywords: searchValue,
    })
    router.push({
      pathname: ROUTES.SEARCH,
      query,
    })
    // setSearchValue('')
  }

  const searchInput = () => (
    <div className='flex gap-2'>
      <Input
        placeholder='Search'
        value={searchValue}
        onChange={handleSearchValueChange}
        onKeyDown={(e) =>
          e.key === 'Enter' && handleSearch()
        }
      />
      <Button onClick={handleSearch}>
        <Search />
      </Button>
    </div>
  )

  const sortValues: SortOrder[] = [
    'relevance',
    'newest',
    'oldest',
    'lowest price',
    'highest price',
  ]
  const [selectedSort, setSelectedSort] = useState(
    sortValues[0],
  )

  const handleSortValueChange = (value: string) => {
    setSelectedSort(value as SortOrder)
    router.push({
      pathname: ROUTES.SEARCH,
      query: {
        ...paramsToQuery(params),
        sortOrder: selectedSort,
      },
    })
  }

  const sortDropdown = () => (
    <Select
      value={selectedSort}
      onValueChange={handleSortValueChange}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue>Sorted by {selectedSort}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {sortValues.map((s, i) => (
            <SelectItem key={i} value={s}>
              {s[0].toUpperCase() + s.substring(1)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )

  return (
    <Card className='flex h-full items-center p-2'>
      <span className='hidden flex-1 justify-start sm:flex'>
        {viewToggle()}
      </span>

      <span className='flex flex-1 justify-center'>
        {searchInput()}
      </span>

      <span className='flex flex-1 justify-end'>
        {sortDropdown()}
      </span>
    </Card>
  )
}
