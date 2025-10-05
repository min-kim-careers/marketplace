'use client'

import useFirebaseStore from '@/lib/stores/firebase-store'
import { auth } from '@/lib/utils/firebase/config'
import { onIdTokenChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'

export const useLoadToken = () => {
  const { user } = useFirebaseStore()
  const [token, setToken] = useState<string | undefined>()
  useEffect(() => {
    if (!user) return

    const unsub = onIdTokenChanged(auth, async (fbUser) => {
      if (fbUser) {
        const t = await fbUser.getIdToken()
        setToken(t)
      } else {
        setToken(undefined)
      }
    })

    return () => unsub()
  }, [user])

  return token
}
