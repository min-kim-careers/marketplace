'use client'

import useFirebaseStore from '@/lib/stores/firebase-store'
import { useEffect, useState } from 'react'

export const useLoadToken = () => {
  const { user } = useFirebaseStore()
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    const loadToken = async () => {
      if (!token && user) {
        const token = await user?.getIdToken()
        if (token) setToken(token)
      }
    }

    loadToken()
  }, [user])

  return token
}
