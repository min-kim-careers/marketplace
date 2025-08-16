import LoadingDots from '@/components/loading-dots'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useAuthHandler } from '@/lib/hooks/use-auth-handler'
import useProfileStore from '@/lib/stores/profile-store'
import { CircleUserIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../shadcn/components/ui/button'
import Dropdown from './dropdown'
import NotificationCountBadge from '@/components/notification-count-badge'
import { useEffect, useState } from 'react'
import { getUnreadMessagesCount } from '@/api/service/chat'

const useNotificationCount = () => {
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    const getCount = async () => {
      const count = await getUnreadMessagesCount()
      if (count) setCount(count)
    }

    getCount()
  }, [])

  return count
}

export default function NavBar() {
  const { profile } = useProfileStore()
  const { handleSignIn, handleSignOut } = useAuthHandler()
  const notificationCount = useNotificationCount()

  if (!profile)
    return <Button onClick={handleSignIn}>Sign in with Google</Button>

  if (!profile.handle) return <Button onClick={handleSignOut}>Sign out</Button>

  return (
    <span className='flex items-center justify-between gap-4'>
      <Link href={`${APP_ROUTES.MARKET.href}`} passHref>
        <Button>Browse</Button>
      </Link>
      <Link href={APP_ROUTES.ITEM_POST.href}>
        <Button>Post Ad</Button>
      </Link>

      <Dropdown>
        <div>
          <Avatar className='relative'>
            <AvatarImage src={profile.avatarUrl} />
            <AvatarFallback>
              {profile ? (
                <CircleUserIcon className='h-full w-full' />
              ) : (
                <LoadingDots />
              )}
            </AvatarFallback>
          </Avatar>
          <NotificationCountBadge count={notificationCount} />
        </div>
      </Dropdown>
    </span>
  )
}
