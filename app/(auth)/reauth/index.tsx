'use client'

import { verifySession } from '@/api'
import LoadingDots from '@/components/loading-dots'
import { delay } from '@/lib/helpers/delay'
import { useAuthContext } from '@/lib/providers/auth-provider'
import { auth } from '@/lib/utils/firebase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Reauth({ next }: { next: string }) {
  const router = useRouter()
  const { isAuthenticated, authReady } = useAuthContext()

  useEffect(() => {
    const handleAuth = async () => {
      if (!next || !authReady) return

      if (isAuthenticated) {
        await verifySession()
        await delay(1000)
        router.replace(next)
      } else {
        await delay(1000)
        await auth.signOut()
      }
    }

    handleAuth()
  }, [next, authReady, isAuthenticated])

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
