'use client'

import { SIGN_IN_WITH_GOOGLE, SIGN_OUT } from '@/lib/clients/auth'
import { auth } from '@/lib/firebase/config'
import { hasSession } from '@/lib/helpers/server/has-session'
import useFirebaseStore from '@/lib/stores/firebase-store'
import useProfileStore from '@/lib/stores/profile-store'
import { logInfo } from '@/lib/utils/log'
import { onAuthStateChanged, User } from 'firebase/auth'
import { useEffect } from 'react'

export const AuthManager = () => {
  const { profile, setProfile } = useProfileStore()
  const { user, setUser } = useFirebaseStore()

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
    const unsubscribe = onAuthStateChanged(auth, async (_user) => {
      const hasSignedIn = !!_user
      const hasSignedOut = !_user

      if (hasSignedIn) {
        logInfo('signed in')
        setUser(_user)
        !(await hasSession()) && (await refreshSession(_user))
      }

      if (hasSignedOut) {
        logInfo('signed out')

        user && setUser(undefined)
        console.log('user unset')

        profile && setProfile(undefined)
        console.log('profile unset')

        !!(await hasSession()) && (await SIGN_OUT())
      }
    })

    return () => unsubscribe()
  }, [])

  return null
}
