import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/components/ui/select'
import { ITEM_SORT_OPTIONS } from '@/lib/constants/item-sort-options'
import { toUrlParams } from '@/lib/helpers/to-url-params'
import { IItemSortOption } from '@/lib/interfaces/item-sort-options'
import { IItemPageParams } from '@/lib/interfaces/item-page-params'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useItemPageStore } from '@/lib/providers/item-page-provider'

export default function SortDropdown() {
  const sortOptions = ITEM_SORT_OPTIONS

  const params = useItemPageStore((store) => store.params)
  const route = useItemPageStore((store) => store.route)

  const [currentSortOption, setCurrentSortOption] =
    useState<IItemSortOption | null>(null)
    
  const router = useRouter()

  useEffect(() => {
    const defaultSortOption = sortOptions.find(
      (s) => s.isDefault,
    )
    if (defaultSortOption)
      setCurrentSortOption(defaultSortOption)
  }, [sortOptions])

  const handleValueChange = (value: string) => {
    const option = sortOptions.find(
      (s) => s.label === value,
    )
    if (option) {
      setCurrentSortOption(option)
      const newParams: IItemPageParams = {
        ...params,
        sortBy: option.sortBy,
        sortOrder: option.sortOrder,
      }
      const urlParams = toUrlParams(newParams)
      router.replace(
        `${route}?${urlParams}`,
      )
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
