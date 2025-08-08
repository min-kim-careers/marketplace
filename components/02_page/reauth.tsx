'use client'

import LoadingDots from '@/components/00_common/loading-dots'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { delay } from '@/lib/helpers/delay'
import { useAuthContext } from '@/lib/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Reauth({ next }: { next: string }) {
  const router = useRouter()
  const { authenticated, authReady } = useAuthContext()

  useEffect(() => {
    const handleAuth = async () => {
      if (!next || !authReady) return

      if (authenticated) {
        await delay(2000)
        router.replace(next)
      } else {
        await delay(2000)
        router.replace(APP_ROUTES.HOME.href)
      }
    }

    handleAuth()
  }, [next, authenticated, authReady])

  if (!authReady)
    return (
      <div className='flex h-screen w-screen flex-1 items-center justify-center'>
        <div className='flex flex-col gap-4'>
          <p>Verifying...</p>
          <LoadingDots />
        </div>
      </div>
    )

  return (
    <div className='flex h-screen w-screen flex-1 items-center justify-center'>
      {authenticated ? (
        <div className='flex flex-col gap-4'>
          <p>Authenticated. Redirecting..</p>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <p>Authentication failed. Signing out...</p>
        </div>
      )}
    </div>
  )
}
