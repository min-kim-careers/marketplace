import { ToggleGroup, ToggleGroupItem } from "@/components/shadcn/components/ui/toggle-group";
import { useLayoutStore } from "@/lib/stores/layout";
import { Grip, Menu } from "lucide-react";

export default function ColumnToggle() {
  const { columns, setColumns } = useLayoutStore()
  
  return (
    <ToggleGroup
      type='single'
      onValueChange={(value) => setColumns(+value)}
      defaultValue={columns.toString()}
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
