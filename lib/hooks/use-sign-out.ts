'use client'

import { APP_ROUTES } from '@/lib/constants/app-routes'
import { useLoadingStore } from '../providers/loading-provider'
import { auth } from '@/lib/utils/firebase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useSignOut = () => {
  const { setLoading } = useLoadingStore()
  const router = useRouter()

  const handleSignOut = async () => {
    let toastMsg = ''

    try {
      setLoading('Signing you out...')
      await auth.signOut()
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
