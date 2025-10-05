'use client'

import { getSession, revokeSession } from '@/api/service/auth'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { clearSession } from '@/lib/helpers/server/clear-session'
import { useLoadingStore } from '@/lib/providers/loading-provider'
import useFirebaseStore from '@/lib/stores/firebase-store'
import useProfileStore from '@/lib/stores/profile-store'
import { auth, provider } from '@/lib/utils/firebase/config'
import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useAuthHandler = () => {
  const { setLoading } = useLoadingStore()
  const { setProfile } = useProfileStore()
  const { setUser } = useFirebaseStore()

  const router = useRouter()

  const handleSignInWithGoogle = async () => {
    let toastMsg = ''

    try {
      setLoading('Signing you in')
      const cred = await signInWithPopup(auth, provider)

      const idToken = await cred.user.getIdToken()

      const profile = await getSession({ idToken })
      if (!profile) throw new Error()
      setProfile(profile)

      toastMsg = `Signed in as ${profile.handle}.`
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user') {
          console.log('user closed popup')
        }
      } else {
        toastMsg = `Something went wrong.`
      }
      await globalSignOut()
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
  }

  const handleCreateUserWithPassword = async (
    email: string,
    password: string,
    nonce: string,
  ) => {
    let toastMsg = ''

    try {
      setLoading('Account not found. Signing you up')
      const cred = await createUserWithEmailAndPassword(auth, email, password)

      const idToken = await cred.user.getIdToken()

      const profile = await getSession({ idToken, nonce, isNewUser: true })
      if (!profile) throw new Error()
      setProfile(profile)

      toastMsg = `Signed in as ${profile.handle}.`
    } catch (error) {
      toastMsg = `Something went wrong.`
      await globalSignOut()
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
  }

  const handleSignInWithPassword = async (
    email: string,
    password: string,
    nonce: string,
  ) => {
    let toastMsg = ''

    try {
      setLoading('Signing you in')
      const cred = await signInWithEmailAndPassword(auth, email, password)

      const idToken = await cred.user.getIdToken()

      const profile = await getSession({ idToken, nonce, isNewUser: false })
      if (!profile) throw new Error()
      setProfile(profile)

      toastMsg = `Signed in as ${profile.handle}.`
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/invalid-credential' ||
          error.code === 'auth/invalid-login-credentials'
        ) {
          await handleCreateUserWithPassword(email, password, nonce)
        }
      } else {
        toastMsg = `Something went wrong.`
        await globalSignOut()
      }
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
  }

  const handleSignOut = async () => {
    let toastMsg = ''

    try {
      setLoading('Signing you out...')
      await globalSignOut()
      toastMsg = `See you again!`
      router.replace(APP_ROUTES.HOME.href)
    } catch (error) {
      console.log(error)
      toastMsg = `Something went wrong.`
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
  }

  const refreshSession = async (user: User) => {
    try {
      const idToken = await user.getIdToken(true)
      const profile = await getSession({ idToken })
      if (!profile) return false
      setProfile(profile)
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const globalSignOut = async () => {
    try {
      auth.signOut()
      await revokeSession()
      await clearSession()
      setProfile()
      setUser()
    } catch (error) {
      throw error
    }
  }

  return {
    handleSignInWithGoogle,
    handleSignInWithPassword,
    handleSignOut,
    refreshSession,
    globalSignOut,
  }
}
