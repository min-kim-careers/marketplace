'use client'

import { ROUTES } from '@/lib/constants/routes'
import useAuthStore from '@/lib/stores/auth'
import Link from 'next/link'
import Menu from './menu'
import { Button } from '../shadcn/components/ui/button'
import { toast } from '@/components/shadcn/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { profile, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    const { success, handle } = await logout()

    if (success && !!handle) {
      router.replace(ROUTES.HOME)
      toast({
        description: `You logged out successfully. Good bye ${handle}`,
      })
    } else {
      toast({
        description: `You failed to log out `,
      })
    }
  }

  const renderLoggedIn = () => (
    <span className='flex items-center justify-between gap-4'>
      <Button>
        <Link
          href={{
            pathname: ROUTES.MARKET,
            query: { page: '1' },
          }}
        >
          Browse
        </Link>
      </Button>
      <Button>
        <Link href={ROUTES.POST}>Post Ad</Link>
      </Button>
      <Menu handleLogout={handleLogout} />
    </span>
  )

  const renderLoggedOut = () => (
    <span className='flex gap-4'>
      <Link href={ROUTES.LOGIN}>
        <Button>Login</Button>
      </Link>
      <Link href={ROUTES.SIGNUP}>
        <Button>Signup</Button>
      </Link>
    </span>
  )

  return (
    <div className='flex w-full items-center justify-between p-4'>
      <Link
        href={ROUTES.HOME}
        className='text-2xl font-bold'
      >
        Marketplace
      </Link>

      {profile ? renderLoggedIn() : renderLoggedOut()}
    </div>
  )
}
