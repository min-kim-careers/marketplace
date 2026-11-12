import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/components/ui/select'
import { ITEM_STATUS_LABELS } from '@/lib/constants/item-status-labels'
import { ItemStatus } from '@/lib/enums/item-status'
import { useItemHandler } from '@/lib/hooks/use-item-handler'
import { Item } from '@/lib/types/item'
import { useRouter } from 'next/navigation'

export default function ItemStatusSelect({ item }: { item: Item }) {
  const { handleUpsert } = useItemHandler()
  const router = useRouter()

  const handleStatusChange = async (status: ItemStatus) => {
    if (await handleUpsert({ request: { status }, alias: item.alias })) {
      router.refresh()
    }
  }

  return (
    <div>
      <Select value={item.status} onValueChange={handleStatusChange}>
        <SelectTrigger className='w-32'>
          <SelectValue>
            <span className='flex flex-row items-center gap-2 pr-2'>
              <span>{ITEM_STATUS_LABELS[item.status]}</span>
              <span></span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(ITEM_STATUS_LABELS).map(([_status, label]) => (
            <SelectItem value={_status.toString()} key={_status}>
              <span>{label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
