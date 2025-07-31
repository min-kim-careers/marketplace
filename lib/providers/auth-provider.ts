'use client'

import { REVOKE_SESSION, SIGN_IN_WITH_GOOGLE } from '@/api/auth'
import { clearSession } from '@/lib/helpers/server/clear-session'
import { globalSignOut } from '@/lib/helpers/server/global-sign-out'
import { hasSession } from '@/lib/helpers/server/has-session'
import useFirebaseStore from '@/lib/stores/firebase-store'
import useProfileStore from '@/lib/stores/profile-store'
import { auth } from '@/lib/utils/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { ReactNode, useEffect, useState } from 'react'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { profile, setProfile } = useProfileStore()
  const { user, setUser } = useFirebaseStore()

  const [authChecked, setAuthChecked] = useState<boolean>(false)

  const refreshSession = async (user: User) => {
    try {
      const token = await user.getIdToken(true)
      const { profile } = await SIGN_IN_WITH_GOOGLE(token)
      setProfile(profile)
    } catch (error) {
      await auth.signOut()
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
        if (await hasSession()) await globalSignOut()
      }
    }

    handleAuth()
  }, [authChecked, user, profile])

  return children
}
