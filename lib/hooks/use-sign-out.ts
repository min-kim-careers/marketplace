import { SIGN_OUT } from '@/_gateway/auth/service'
import { auth } from '@/lib/firebase/config'
import { useLoadingStore } from '@/lib/stores/loading-store'
import useProfileStore from '@/lib/stores/profile-store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useSignOut = () => {
  const { setLoading } = useLoadingStore()
  const { setProfile } = useProfileStore()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setLoading('Signing you out...')

      await auth.signOut()
      await SIGN_OUT()
      setProfile(null)

      toast(`See you again!`)

      router.refresh()
    } catch (error) {
      toast(`Something went wrong.`)
    } finally {
      setLoading(null)
    }
  }

  return { handleSignOut }
}
