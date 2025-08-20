'use client'

import { AuthStatus } from '@/lib/providers/auth-provider'
import useFirebaseStore from '@/lib/stores/firebase-store'
import { auth } from '@/lib/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'

export const useAuthClient = (
  updateStatus: (status: AuthStatus) => void
) => {
  const { user, setUser } = useFirebaseStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        updateStatus('authenticated')
      } else {
        setUser()
        updateStatus('unauthenticated')
      }
    })
    return () => unsubscribe()
  }, [])

  return { user }
}
