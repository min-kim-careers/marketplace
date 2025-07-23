'use client'

import { hasSessionCookie } from '@/_gateway/auth/_config/helpers'
import { SIGN_IN_WITH_GOOGLE } from '@/lib/clients/firebase'
import { auth } from '@/lib/firebase/config'
import { useSignOut } from '@/lib/hooks/use-sign-out'
import useFirebaseStore from '@/lib/stores/firebase-store'
import useProfileStore from '@/lib/stores/profile-store'
import { logInfo } from '@/lib/utils/log'
import { onIdTokenChanged, User } from 'firebase/auth'
import { useEffect } from 'react'

export default function FirebaseAuthListener() {
  const { profile, setProfile } = useProfileStore()
  const { setUser } = useFirebaseStore()
  const { handleSignOut } = useSignOut()

  const refreshSession = async (user: User) => {
    try {
      const token = await user.getIdToken(true)
      const newProfile = await SIGN_IN_WITH_GOOGLE(token)
      if (newProfile) setProfile(newProfile)
    } catch (error) {
      await handleSignOut()
    }
  }

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      const hasSignedIn = !!user
      const hasSignedOut = !user

      if (hasSignedIn) {
        logInfo('signed in')
        setUser(user)
        if (!await hasSessionCookie()) await refreshSession(user)
      }

      if (hasSignedOut) {
        logInfo('signed out')
        setUser(null)
        if (profile) setProfile(null)
      }
    })

    return () => unsubscribe()
  }, [])

  return null
}
