'use client'

import { verifySession } from '@/api'
import LoadingDots from '@/components/00_common/loading-dots'
import { delay } from '@/lib/helpers/delay'
import { useAuthContext } from '@/lib/providers/auth-provider'
import { auth } from '@/lib/utils/firebase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Reauth({ next }: { next: string }) {
  const router = useRouter()
  const { isAuthenticated, authReady } = useAuthContext()
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const handleAuth = async () => {
      if (!next || !authReady) return

      if (await isAuthenticated()) {
        setAuthenticated(true)
        await delay(2000)
        router.replace(next)
      } else {
        await delay(2000)
        await auth.signOut()
      }
    }

    handleAuth()
  }, [next, authReady])

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
