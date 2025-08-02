'use client'

import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useLoadingStore } from '../providers/loading-provider'
import { auth } from '@/lib/utils/firebase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { globalSignOut } from '@/lib/helpers/server/global-sign-out'
import useFirebaseStore from '@/lib/stores/firebase-store'

export const useSignOut = () => {
  const { setLoading } = useLoadingStore()
  const { setUser } = useFirebaseStore()
  const router = useRouter()

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

  return { handleSignOut }
}
