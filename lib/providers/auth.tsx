'use client'

import { useEffect } from 'react'
import useAuthStore from '../stores/auth'
import {
  cacheProfile,
  clearProfile,
  loadProfile,
} from '../cache/profile'

export default function AuthProvider() {
  const { setUser, setInitialised } = useAuthStore()

  // const handleSignedIn = (user: User) => {
  //   console.log('User signed in')

  //   const cachedProfile = loadProfile()

  //   if (!!cachedProfile) return setProfile(cachedProfile)

  //   const newProfile = {
  //     userId: user.uid,
  //     email: user.email || 'some email',
  //     handle: '',
  //     rating: 0,
  //     ratingCount: 0,
  //   }

  //   cacheProfile(newProfile)

  //   setProfile(newProfile)
  // }

  // const handleSignedOut = () => {
  //   console.log('User signed out')

  //   clearProfile()
  // }

  useEffect(() => {
    setInitialised(true)

    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   setInitialised(true)

    //   if (!!user) {
    //     handleSignedIn(user)
    //   } else {
    //     handleSignedOut()
    //   }
    // })

    // return () => unsubscribe()
  }, [])

  return null
}
