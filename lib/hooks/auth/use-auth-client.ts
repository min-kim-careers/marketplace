'use client'

import { AuthStatus } from '@/lib/providers/auth-provider'
import useFirebaseStore from '@/lib/stores/firebase-store'
import { auth } from '@/lib/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { Dispatch, SetStateAction, useEffect } from 'react'

export const useAuthClient = (
  setStatus: Dispatch<
    SetStateAction<{
      client: AuthStatus
      server: AuthStatus
    }>
  >,
) => {
  const { user, setUser } = useFirebaseStore()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)
        setStatus((p) => ({ ...p, client: 'authenticated' }))
      } else {
        setUser()
        setStatus((p) => ({ ...p, client: 'unauthenticated' }))
      }
    })
    return () => unsubscribe()
  }, [])

  return { user }
}
