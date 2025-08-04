'use client'

import { signInWithGoogle } from '@/api/service/auth'
import { hasSession } from '@/lib/helpers/server/has-session'
import { useAuthHandler } from '@/lib/hooks/use-auth-handler'
import useFirebaseStore from '@/lib/stores/firebase-store'
import useProfileStore from '@/lib/stores/profile-store'
import { auth } from '@/lib/utils/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { ReactNode, useEffect, useState } from 'react'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { profile, setProfile } = useProfileStore()
  const { user, setUser } = useFirebaseStore()
  const { handleSignOut } = useAuthHandler()

  const [authChecked, setAuthChecked] = useState<boolean>(false)

  const refreshSession = async (user: User) => {
    try {
      const token = await user.getIdToken(true)
      const profile = await signInWithGoogle(token)
      if (!profile) throw new Error('failed to refresh session')

      setProfile(profile)
    } catch (_) {
      await handleSignOut()
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      user ? setUser(user) : setUser(undefined)
      setAuthChecked(true)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleAuth = async () => {
      if (!authChecked) return

      if (user) {
        if (!(await hasSession())) await refreshSession(user)
      } else {
        if (profile) setProfile(undefined)
        if (await hasSession()) await handleSignOut()
      }
    }

    handleAuth()
  }, [authChecked, user, profile])

  return children
}
