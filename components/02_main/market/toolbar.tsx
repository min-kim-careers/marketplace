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
import { ROUTES } from '@/lib/constants/routes'
import {
  extractParams,
  paramsToQuery,
} from '@/lib/utils/common'
import useCustomRouter from '@/lib/hooks/use-custom-router'
import { Grip, Menu, Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'

export default function Toolbar({
  setColumns,
  defaultColumns,
}: {
  setColumns: (value: number) => void
  defaultColumns: number
}) {
  const searchParams = useSearchParams()
  const urlParams = extractParams(searchParams)
  const router = useCustomRouter()

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
      ...urlParams,
      page: 1,
      keyword: searchValue,
    })
    router.push({
      pathname: ROUTES.MARKET,
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

  const SORT_MAP: Record<string, string> = {}


  const sortValues: string[] =
    Object.keys(SORT_MAP)

  const [selectedSort, setSelectedSort] =
    useState(sortValues[0])

  const handleSortValueChange = (value: string) => {
    setSelectedSort(value)
  }

  useEffect(() => {
    const serverSort = SORT_MAP[selectedSort]
    router.push({
      pathname: ROUTES.MARKET,
      query: {
        ...paramsToQuery(urlParams),
      },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSort])

  const sortDropdown = () => (
    <Select
      value={selectedSort}
      onValueChange={handleSortValueChange}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue>
          Sorted by {selectedSort}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {sortValues.map((s, i) => (
            <SelectItem
              key={i}
              value={s}
            >
              {s}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )

  return (
    <Card className='flex items-center p-2'>
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
