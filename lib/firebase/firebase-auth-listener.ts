'use client'

import { auth } from '@/lib/firebase/config'
import { useSignOut } from '@/lib/hooks/use-sign-out'
import useProfileStore from '@/lib/stores/profile-store'
import { logInfo } from '@/lib/utils/log'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

export default function FirebaseAuthListener() {
  const { profile, setProfile } = useProfileStore()
  const { handleSignOut } = useSignOut()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        const hasSignedIn = !!user
        const hasSignedOut = !user

        if (hasSignedIn) {
          logInfo('signed in')
        }

        if (hasSignedOut) {
          logInfo('signed out')

          if (profile) setProfile(null)
        }
      },
    )

    return () => unsubscribe()
  }, [])

  return null
}
