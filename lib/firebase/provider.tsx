'use client'

import { auth } from '@/lib/firebase/configs/client'
import useFirebaseStore from '@/lib/firebase/store'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

export default function FirebaseProvider() {
  const { setUser } = useFirebaseStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          console.log('User is signed in')
          setUser(user)
        } else {
          console.log('User is signed out')
          setUser(null)
        }
      },
    )

    return () => unsubscribe()
  }, [])

  return null
}
