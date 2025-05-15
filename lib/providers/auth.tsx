'use client'

import { useEffect } from 'react'
import useAuthStore from '../stores/auth'

export default function AuthProvider() {
  // const handleProfileState = 

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe(
      (state) => state.profile,
      (profile, prevProfile) => {
        const signedIn = !prevProfile && !!profile
        const signedOut = !!prevProfile && !profile

        if (signedIn) {
          console.log('Welcome!')
        } else if (signedOut) {
          console.log('Goodbye!')
        }
      },
    )

    return () => unsubscribe()
  }, [])

  return null
}
