'use client'

import { verifySession } from '@/api'
import LoadingDots from '@/components/loading-dots'
import { delay } from '@/lib/helpers/delay'
import { useAuthHandler } from '@/lib/hooks/auth/use-auth-handler'
import { useAuthContext } from '@/lib/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Reauth({ next }: { next: string }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthContext()
  const { globalSignOut } = useAuthHandler()

  useEffect(() => {
    const handleReauth = async () => {
      if (!next || isLoading) return

      if (isAuthenticated) {
        await verifySession()
        await delay(1000)
        router.replace(next)
      } else {
        await delay(1000)
        await globalSignOut()
      }
    }

    handleReauth()
  }, [next, isLoading, isAuthenticated])

  if (isLoading)
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
      {isAuthenticated ? (
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
