'use client'

import { signInWithGoogle } from '@/api/service/auth'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { globalSignOut } from '@/lib/helpers/global-sign-out'
import { auth, provider } from '@/lib/utils/firebase'
import { FirebaseError } from 'firebase/app'
import { signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useLoadingStore } from '../providers/loading-provider'

export const useAuthHandler = () => {
  const { setLoading } = useLoadingStore()

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

  return { handleSignIn, handleSignOut }
}
