'use client'

import { auth } from '@/lib/firebase/config'
import { Profile } from '@/lib/interfaces/profiles'
import useProfileStore from '@/lib/stores/profile'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

export default function FirebaseAuthListener() {
  const { profile, setProfile } = useProfileStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const hasSignedIn = !!user
      const hasSignedOut = !user

      if (hasSignedIn) {
      }

      if (hasSignedOut) {
        if (profile) setProfile(null)
      }
    })

    return () => unsubscribe()
  }, [])

  return null
}
