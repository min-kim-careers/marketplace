'use client'

import { useEffect } from 'react'
import useAuthStore from '../stores/auth'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../services/firebase/config'
import {
  cacheProfile,
  clearProfile,
  loadProfile,
} from '../cache/profile'

export default function AuthProvider() {
  const { setProfile, setInitialised } = useAuthStore()

  const handleSignedIn = (user: User) => {
    console.log('User signed in')

    const cachedProfile = loadProfile()

    if (!!cachedProfile) return setProfile(cachedProfile)

    const newProfile = {
      userId: user.uid,
      email: user.email || 'some email',
      handle: '',
      rating: 0,
      ratingCount: 0,
    }

    cacheProfile(newProfile)

    setProfile(newProfile)
  }

  const handleSignedOut = () => {
    console.log('User signed out')

    clearProfile()
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setInitialised(true)

      if (!!user) {
        handleSignedIn(user)
      } else {
        handleSignedOut()
      }
    })

    return () => unsubscribe()
  }, [])

  return null
}
