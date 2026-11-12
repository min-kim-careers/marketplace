'use client'

import { verifySession } from '@/api'
import LoadingDots from '@/components/loading-dots'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { delay } from '@/lib/helpers/delay'
import { useAuthHandler } from '@/lib/hooks/use-auth-handler'
import { useAuthContext } from '@/lib/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Reauth({ next }: { next: string }) {
  const router = useRouter()
  const { status } = useAuthContext()
  const { globalSignOut } = useAuthHandler()

  useEffect(() => {
    const handleReauth = async () => {
      if (!next || status === 'loading') return

      if (status === 'authenticated') {
        await verifySession()
        await delay(1000)
        router.replace(next)
      } else {
        await delay(1000)
        await globalSignOut()
        router.replace(APP_ROUTES.HOME.href)
      }
    }

    handleReauth()
  }, [next, status])

  if (status === 'loading')
    return (
      <div className='flex h-screen w-screen flex-1 items-center justify-center'>
        <div className='flex flex-col gap-4'>
          <p>Reauthenticating...</p>
          <LoadingDots />
        </div>
      </div>
    )

  return (
    <div className='flex h-screen w-screen flex-1 items-center justify-center'>
      {status === 'authenticated' ? (
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
