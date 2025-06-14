import { ROUTES } from '@/lib/constants/routes'
import { serialize } from '@/lib/common/market-helpers'
import useProfileStore from '@/lib/stores/profile'
import Link from 'next/link'
import { Button } from '../../shadcn/components/ui/button'
import Dropdown from './dropdown'
import { useSignIn } from '@/lib/hooks/use-sign-in'
import { useSignOut } from '@/lib/hooks/use-sign-out'

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
        href={{
          pathname: ROUTES.MARKET,
          query: serialize({ page: 1 }),
        }}
        passHref
      >
        <Button>Browse</Button>
      </Link>
      <Link href={ROUTES.POST}>
        <Button>Post Ad</Button>
      </Link>
      <Dropdown />
    </span>
  )
}
