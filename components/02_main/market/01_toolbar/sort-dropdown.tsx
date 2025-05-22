import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/components/ui/select'
import { useState } from 'react'

export default function SortDropdown() {
  const SORT_MAP: Record<string, string> = {}

  const sortValues: string[] = Object.keys(SORT_MAP)

  const [selectedSort, setSelectedSort] = useState(
    sortValues[0],
  )

  const handleSortValueChange = (value: string) => {
    setSelectedSort(value)
  }

  return (
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
              {s}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
