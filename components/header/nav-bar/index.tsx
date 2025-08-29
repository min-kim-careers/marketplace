import LoadingDots from '@/components/loading-dots'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useAuthHandler } from '@/lib/hooks/auth/use-auth-handler'
import { useAuthContext } from '@/lib/providers/auth-provider'
import useProfileStore from '@/lib/stores/profile-store'
import { CircleUserIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../../shadcn/components/ui/button'
import Dropdown from './dropdown'

export default function NavBar() {
  const { profile } = useProfileStore()
  const { isLoading, isAuthenticated } = useAuthContext()
  const { handleSignIn } = useAuthHandler()

  if (isLoading) {
    return (
      <div className='flex-1'>
        <LoadingDots className='h-2 w-2' />
      </div>
    )
  }

  const unauthenticated = () => (
    <Button onClick={handleSignIn}>Sign in with Google</Button>
  )

  const authenticated = () => (
    <span className='flex items-center justify-between gap-4'>
      <Link href={`${APP_ROUTES.MARKET.href}`} passHref>
        <Button>Browse</Button>
      </Link>

      <Link href={APP_ROUTES.ITEM_POST.href}>
        <Button>Post Ad</Button>
      </Link>

      <Dropdown>
        <div>
          <Avatar>
            <AvatarImage src={profile!.avatarUrl} />
            <AvatarFallback>
              {profile ? (
                <CircleUserIcon className='h-full w-full' />
              ) : (
                <LoadingDots />
              )}
            </AvatarFallback>
          </Avatar>
        </div>
      </Dropdown>
    </span>
  )

  return isAuthenticated ? authenticated() : unauthenticated()
}
