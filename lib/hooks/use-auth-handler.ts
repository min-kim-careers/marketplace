'use client'

import { revokeSession, signInWithGoogle } from '@/api/service/auth'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import useFirebaseStore from '@/lib/stores/firebase-store'
import useProfileStore from '@/lib/stores/profile-store'
import { auth, provider } from '@/lib/utils/firebase'
import { FirebaseError } from 'firebase/app'
import { signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useLoadingStore } from '../providers/loading-provider'
import { clearSession } from '@/lib/helpers/server/clear-session'

export const useAuthHandler = () => {
  const { setLoading } = useLoadingStore()
  const { setProfile } = useProfileStore()
  const { setUser } = useFirebaseStore()

  const router = useRouter()

  const handleSignIn = async () => {
    let toastMsg = ''

    try {
      setLoading('Signing you in')
      const cred = await signInWithPopup(auth, provider)

      const token = await cred.user.getIdToken()

      const profile = await signInWithGoogle(token)
      if (!profile) throw new Error()

      toastMsg = `Signed in as ${profile.handle}.`
      router.refresh()
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user') {
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

  const handleSignOut = async () => {
    let toastMsg = ''

    try {
      setLoading('Signing you out...')
      await globalSignOut()
      toastMsg = `See you again!`
      router.replace(APP_ROUTES.HOME.href)
    } catch (error) {
      toastMsg = `Something went wrong.`
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
  }

  const globalSignOut = async () => {
    try {
      auth.signOut()
      setProfile()
      setUser()
      await revokeSession()
      await clearSession()
    } catch (error) {
      throw error
    }
  }

  return { handleSignIn, handleSignOut }
}
