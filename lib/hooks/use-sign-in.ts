'use client'

import { SIGN_IN_WITH_GOOGLE } from '@/gateway/auth'
import { auth, provider } from '@/lib/utils/firebase'
import { useLoadingStore } from '../providers/loading-provider'
import useProfileStore from '@/lib/stores/profile-store'
import { signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FirebaseError } from 'firebase/app'

export const useSignIn = () => {
  const { setProfile } = useProfileStore()
  const { setLoading } = useLoadingStore()
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      setLoading('Signing you in')
      const cred = await signInWithPopup(auth, provider)

      const token = await cred.user.getIdToken()

      const { profile } = await SIGN_IN_WITH_GOOGLE(token)

      setProfile(profile)

      if (profile) toast(`Signed in as ${profile.handle}.`)

      router.refresh()
    } catch (error) {
      let toastMsg = ''
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user') {
        }
      } else {
        toastMsg = `Something went wrong.`
      }

      await auth.signOut()
      if (toastMsg) {
        toast(toastMsg)
      }
    } finally {
      setLoading()
    }
  }

  return { handleSignIn }
}
