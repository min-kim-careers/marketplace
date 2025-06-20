import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/shadcn/components/ui/toggle-group'
import useLayoutStore from '@/lib/stores/layout-store'
import { Grip, Menu } from 'lucide-react'

const ALLOWED_COLUMNS = new Set([1, 3])

export default function ColumnToggle() {
  const { columns, setColumns } = useLayoutStore()
  
  const handleValueChange = (value: string) => {
    const col = +value
    setColumns(ALLOWED_COLUMNS.has(col) ? col : 1)
  }


  return (
    <ToggleGroup
      type='single'
      onValueChange={handleValueChange}
      value={columns.toString()}
    >
      <ToggleGroupItem value='1'>
        <Menu />
      </ToggleGroupItem>
      <ToggleGroupItem value='3'>
        <Grip />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
