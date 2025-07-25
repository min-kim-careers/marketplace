import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/components/ui/select'
import {
  DEFAULT_ITEM_SORT_OPTION,
  ITEM_SORT_OPTIONS,
} from '@/lib/constants/item-sort-options'
import { toURLSearchParams } from '@/lib/helpers/to-url-search-params'
import { ItemPageParams } from '@/lib/types/item-page-params'
import { ItemSortOption } from '@/lib/types/item-sort-options'
import { useItemPageStore } from '@/lib/providers/item-page-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SortDropdown() {
  const { params, route } = useItemPageStore()

  const [currentSortOption, setCurrentSortOption] =
    useState<ItemSortOption | null>(DEFAULT_ITEM_SORT_OPTION)

  const router = useRouter()

  useEffect(() => {
    const newOption = ITEM_SORT_OPTIONS.find(
      (s) => s.sortBy === params.sortBy && s.sortOrder === params.sortOrder,
    )
    if (!newOption) throw new Error()
    setCurrentSortOption(newOption)
  }, [params])

  const handleValueChange = (value: string) => {
    const option = ITEM_SORT_OPTIONS.find((s) => s.label === value)
    if (!option) return

    const newParams: ItemPageParams = {
      ...params,
      sortBy: option.sortBy,
      sortOrder: option.sortOrder,
    }
    router.push(`${route}?${toURLSearchParams(newParams)}`)
  }

  if (!ITEM_SORT_OPTIONS.length || !currentSortOption)
    return (
      <Select>
        <SelectTrigger className='w-[180px]' disabled>
          <SelectValue />
        </SelectTrigger>
      </Select>
    )

  return (
    <Select value={currentSortOption.label} onValueChange={handleValueChange}>
      <SelectTrigger className='w-[180px]'>
        <span>{`Sorted by ${currentSortOption.label}`}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {ITEM_SORT_OPTIONS &&
            ITEM_SORT_OPTIONS.map((s, i) => (
              <SelectItem key={i} value={s.label}>
                {s.label}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
