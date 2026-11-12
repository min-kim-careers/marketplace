import ChatDrawer from '@/chat/chat-drawer'
import LoadingDots from '@/components/loading-dots'
import SignInWithPasswordPopover from '@/components/sign-in/password-popover'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useAuthContext } from '@/lib/providers/auth-provider'
import useProfileStore from '@/lib/stores/profile-store'
import Link from 'next/link'
import { Button } from '../../shadcn/components/ui/button'
import Dropdown from './dropdown'

export default function NavBar() {
  const profile = useProfileStore((state) => state.profile)
  const { status } = useAuthContext()

  if (status === 'loading') {
    return (
      <div className='flex-1'>
        <LoadingDots className='h-2 w-2' />
      </div>
    )
  }

  const unauthenticated = () => (
    <span className='flex items-center space-x-2'>
      <SignInWithPasswordPopover/>
    </span>
  )

  const authenticated = () => {
    if (!profile) {
      return (
        <div className='flex-1'>
          <LoadingDots className='h-2 w-2' />
        </div>
      )
    }

    return (
      <span className='flex items-center gap-4'>
        <span className='flex-1 gap-4 sm:flex'>
          <span className='flex gap-4 max-sm:hidden'>
            <Link href={`${APP_ROUTES.MARKET.href}`} passHref>
              <Button>Browse</Button>
            </Link>
            <Link href={APP_ROUTES.ITEM_POST.href}>
              <Button>Post Ad</Button>
            </Link>
          </span>

          <ChatDrawer useButton />
        </span>

        <Dropdown />
      </span>
    )
  }

  return status === 'authenticated' ? authenticated() : unauthenticated()
}
