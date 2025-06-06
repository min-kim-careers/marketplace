'use client'

import { serviceRefreshSession } from '@/_gateway/firebase/service'
import { auth } from '@/lib/firebase/config'
import { Profile } from '@/lib/interfaces/profiles'
import useProfileStore from '@/lib/stores/profile'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

export default function FirebaseAuthListener() {
  const { profile, setProfile } = useProfileStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        const hasSignedIn = !!user
        const hasSignedOut = !user

        if (hasSignedIn) {
          console.log('signed in')

          try {
            const idToken = await user.getIdToken(true)
            if (idToken)
              await serviceRefreshSession(idToken)
          } catch (error) {
            console.log(error)
          }
        }

        if (hasSignedOut) {
          console.log('signed out')

          if (profile) setProfile(null)
        }
      },
    )

    return () => unsubscribe()
  }, [])

  return null
}
