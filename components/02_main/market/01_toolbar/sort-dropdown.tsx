import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/components/ui/select'
import { ROUTES } from '@/lib/constants/routes'
import {
  marketToUrlParams
} from '@/lib/common/market'
import { MarketParams, SortOption } from '@/lib/interfaces/items'
import { useMarketStore } from '@/lib/stores/market'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SortDropdown() {
  const {
    sortOptions,
    fetchSortOptions,
    params,
    setParams,
  } = useMarketStore()
  useEffect(() => {
    void fetchSortOptions()
  }, [])

  const [currentSortOption, setCurrentSortOption] =
    useState<SortOption | null>(null)
  useEffect(() => {
    const defaultSortOption = sortOptions.find(
      (s) => s.isDefault,
    )
    if (defaultSortOption)
      setCurrentSortOption(defaultSortOption)
  }, [sortOptions])

  const router = useRouter()
  const handleValueChange = (value: string) => {
    const option = sortOptions.find(
      (s) => s.label === value,
    )
    if (option) {
      setCurrentSortOption(option)
      const newParams: MarketParams = {
        ...params,
        sortBy: option.sortBy,
        sortOrder: option.sortOrder,
      }
      const urlParams = marketToUrlParams(newParams)
      router.replace(`${ROUTES.MARKET}?${urlParams}`)
      setParams(newParams)
    }
  }

  if (!sortOptions.length || !currentSortOption)
    return (
      <Select>
        <SelectTrigger className='w-[180px]' disabled>
          <SelectValue />
        </SelectTrigger>
      </Select>
    )

  return (
    <Select
      value={currentSortOption.label}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className='w-[180px]'>
        <span>{`Sorted by ${currentSortOption.label}`}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {sortOptions &&
            sortOptions.map((s, i) => (
              <SelectItem key={i} value={s.label}>
                {s.label}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
