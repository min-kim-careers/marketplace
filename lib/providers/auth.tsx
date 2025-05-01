'use client'

import { useEffect } from 'react'
import useAuthStore from '../stores/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase/config'
import { cacheProfile, clearProfile, loadProfile } from '../cache/profile'

export default function AuthProvider() {
  const { setProfile, setInitialised } = useAuthStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setInitialised(true)

      if (!!user) {
        console.log('User signed in')

        const cachedProfile = loadProfile()

        if (!!cachedProfile)
          return setProfile(cachedProfile)

        const newProfile = {
          userId: user.uid,
          email: user.email || 'some email',
          handle: user.displayName || 'some handle',
          rating: 0,
          ratingCount: 0,
        }

        cacheProfile(newProfile)

        setProfile(newProfile)
      } else {
        console.log('User signed out')

        clearProfile()
      }
    })

    return () => unsubscribe()
  }, [])

  return null
}
