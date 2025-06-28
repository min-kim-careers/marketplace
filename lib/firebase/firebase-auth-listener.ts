'use client'

import { hasSessionCookie } from '@/_gateway/auth/_config/helpers'
import { auth } from '@/lib/firebase/config'
import { useSignOut } from '@/lib/hooks/use-sign-out'
import useFirebaseStore from '@/lib/stores/firebase-store'
import useProfileStore from '@/lib/stores/profile-store'
import { logInfo } from '@/lib/utils/log'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

export default function FirebaseAuthListener() {
  const { profile, setProfile } = useProfileStore()
  const { setUser } = useFirebaseStore()
  const { handleSignOut } = useSignOut()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        const hasSignedIn = !!user
        const hasSignedOut = !user

        if (hasSignedIn) {
          logInfo('signed in')

          setUser(user)
          if (profile && !(await hasSessionCookie()))
            await handleSignOut()
        }

        if (hasSignedOut) {
          logInfo('signed out')

          setUser(null)
          if (profile) setProfile(null)
        }
      },
    )

    return () => unsubscribe()
  }, [])

  return null
}
