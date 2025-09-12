'use client'

import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/shadcn/components/ui/toggle-group'
import useLayoutStore, { ItemColumn } from '@/lib/stores/layout-store'
import { Grip, Menu } from 'lucide-react'

export default function ColumnToggle() {
  const { itemColumns, setItemColumns } = useLayoutStore()

  return (
    <ToggleGroup
      type='single'
      onValueChange={(v) => setItemColumns(Number(v) as ItemColumn)}
      value={itemColumns.toString()}
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
