import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useAuthHandler } from '@/lib/hooks/use-auth-handler'
import useProfileStore from '@/lib/stores/profile-store'
import Link from 'next/link'
import { Button } from '../../shadcn/components/ui/button'
import Dropdown from './dropdown'

export default function NavBar() {
  const { profile } = useProfileStore()
  const { handleSignIn, handleSignOut } = useAuthHandler()

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
      <Dropdown />
    </span>
  )
}
