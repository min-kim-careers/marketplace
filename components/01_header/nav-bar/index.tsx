import {
  toUrlParams
} from '@/lib/common/helpers'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useSignIn } from '@/lib/hooks/use-sign-in'
import { useSignOut } from '@/lib/hooks/use-sign-out'
import useProfileStore from '@/lib/stores/profile'
import Link from 'next/link'
import { Button } from '../../shadcn/components/ui/button'
import Dropdown from './dropdown'

export default function NavBar() {
  const { profile } = useProfileStore()
  const { handleSignIn } = useSignIn()
  const { handleSignOut } = useSignOut()

  if (!profile)
    return (
      <Button onClick={handleSignIn}>
        Sign in with Google
      </Button>
    )

  if (!profile.handle)
    return <Button onClick={handleSignOut}>Sign out</Button>

  return (
    <span className='flex items-center justify-between gap-4'>
      <Link
        href={`${APP_ROUTES.MARKET}?${toUrlParams({ page: 1 })}`}
        passHref
      >
        <Button>Browse</Button>
      </Link>
      <Link href={APP_ROUTES.POST}>
        <Button>Post Ad</Button>
      </Link>
      <Dropdown />
    </span>
  )
}
