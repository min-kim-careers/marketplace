'use client'

import { toast } from '@/components/shadcn/hooks/use-toast'
import { APP_TITLE } from '@/lib/constants'
import { ROUTES } from '@/lib/constants/routes'
import useAuthStore from '@/lib/stores/auth'
import { useLoadingStore } from '@/lib/stores/loading'
import { paramsToQuery } from '@/lib/utils/helpers'
import Link from 'next/link'
import { Button } from '../shadcn/components/ui/button'
import Menu from './menu'

export default function Header() {
  const { profile, signOut } = useAuthStore()
  const { setLoading } = useLoadingStore()

  const handleLogout = async () => {
    setLoading(true, 'Logging you out...')
    try {
      const { success } = await signOut()

      if (!success) {
        toast({
          description: `Failed to log out `,
        })
        return
      }

      toast({
        description: `Logged out successfully.`,
      })
    } finally {
      setLoading(false)
    }
  }

  const renderLoggedIn = () => (
    <span className='flex items-center justify-between gap-4'>
      <Link
        href={{
          pathname: ROUTES.MARKET,
          query: paramsToQuery({ page: 1 }),
        }}
        passHref
      >
        <Button>Browse</Button>
      </Link>
      <Link href={ROUTES.POST}>
        <Button>Post Ad</Button>
      </Link>
      <Menu handleLogout={handleLogout} />
    </span>
  )

  const renderLoggedOut = () => (
    <span className='flex gap-4'>
      <Button>Sign In</Button>
    </span>
  )

  return (
    <div className='flex w-full items-start justify-between pb-2'>
      <Link
        href={ROUTES.HOME}
        className='text-2xl font-bold'
      >
        {APP_TITLE}
      </Link>

      {profile ? renderLoggedIn() : renderLoggedOut()}
    </div>
  )
}
