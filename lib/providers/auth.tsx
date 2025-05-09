'use client'

import { useEffect } from 'react'
import useAuthStore from '../stores/auth'
import { loadUserCache } from '../cache/user'

export default function AuthProvider() {
  // const { setUser } = useAuthStore()

  // useEffect(() => {
  //   const unsubscribe = useAuthStore.subscribe(
  //     (state) => state.user,
  //     (user, prevUser) => {
  //       const cachedUser = loadUserCache()
  //       if (!cachedUser) return

  //       setUser(cachedUser)
  //     },
  //     { fireImmediately: true },
  //   )

  //   return () => unsubscribe()
  // }, [])

  return null
}
