import { Button } from '@/components/shadcn/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/shadcn/components/ui/card'
import { SidebarClose } from 'lucide-react'

export default function Chat() {
  return (
    <div className='flex min-h-full w-full flex-1 flex-row gap-2'>
      <Card className='min-h-full w-1/6'>
        <CardHeader>
          <div className='flex flex-row justify-center items-center'>
            <span>Active Chats</span>
          </div>
        </CardHeader>
      </Card>
      <Card className='min-h-full w-5/6'>
        <CardHeader>Item </CardHeader>
      </Card>
    </div>
  )
}
