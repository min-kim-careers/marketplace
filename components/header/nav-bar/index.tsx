import { getUnreadMessagesCount } from '@/api/service/chat'
import LoadingDots from '@/components/loading-dots'
import NotificationCountBadge from '@/components/notification-count-badge'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useAuthHandler } from '@/lib/hooks/use-auth-handler'
import { useAuthContext } from '@/lib/providers/auth-provider'
import useProfileStore from '@/lib/stores/profile-store'
import { CircleUserIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '../../shadcn/components/ui/button'
import Dropdown from './dropdown'
import { hasSession } from '@/lib/helpers/server/has-session'
import useFirebaseStore from '@/lib/stores/firebase-store'

const useNotificationCount = () => {
  const [count, setCount] = useState<number>(0)
  const { isAuthenticated } = useAuthContext()

  useEffect(() => {
    const getCount = async () => {
      if (isAuthenticated) setCount(await getUnreadMessagesCount())
    }

    getCount()
  }, [])

  return count
}

export default function NavBar() {
  const notificationCount = useNotificationCount()

  const { profile } = useProfileStore()
  const { isAuthenticated } = useAuthContext()
  const { handleSignIn } = useAuthHandler()

  if (!isAuthenticated)
    return <Button onClick={handleSignIn}>Sign in with Google</Button>

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
            <AvatarImage src={profile!.avatarUrl} />
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
