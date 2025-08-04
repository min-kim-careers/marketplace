'use client'

import { auth, provider } from '@/lib/utils/firebase'
import { useLoadingStore } from '../providers/loading-provider'
import useProfileStore from '@/lib/stores/profile-store'
import { signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FirebaseError } from 'firebase/app'
import { signInWithGoogle } from '@/api/service/auth'
import useFirebaseStore from '@/lib/stores/firebase-store'
import { globalSignOut } from '@/lib/helpers/server/global-sign-out'
import { APP_ROUTES } from '@/lib/constants/app-routes'

export const useAuthHandler = () => {
  const { setProfile } = useProfileStore()
  const { setLoading } = useLoadingStore()
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

      setProfile(profile)
      toastMsg = `Signed in as ${profile.handle}.`
      router.refresh()
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user') {
        }
      } else {
        toastMsg = `Something went wrong.`
      }
      await auth.signOut()
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
  }

  const handleSignOut = async () => {
    let toastMsg = ''

    try {
      setLoading('Signing you out...')
      setUser()
      await auth.signOut()
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

  return { handleSignIn, handleSignOut }
}
