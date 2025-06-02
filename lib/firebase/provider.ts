'use client'

import { auth } from '@/lib/firebase/config'
import { Profile } from '@/lib/interfaces/profiles'
import useProfileStore from '@/lib/stores/profile'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

export default function FirebaseProvider() {
  const { setProfile } = useProfileStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setProfile({ email: user.email } as Profile)
    })

    return () => unsubscribe()
  }, [])

  return null
}
