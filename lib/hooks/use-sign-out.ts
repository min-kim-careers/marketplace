import { signOut } from '@/_gateway/firebase/service'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { auth } from '@/lib/firebase/config'
import { useLoadingStore } from '@/lib/stores/loading'
import useProfileStore from '@/lib/stores/profile'
import { useRouter } from 'next/navigation'

export const useSignOut = () => {
  const { setLoading } = useLoadingStore()
  const { setProfile } = useProfileStore()
  const { toast } = useToast()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setLoading('Signing you out...')

      await auth.signOut()
      await signOut()
      setProfile(null)

      toast({
        description: `See you again!`,
      })

      router.refresh()
    } catch (error) {
      toast({
        description: `Something went wrong.`,
      })
    } finally {
      setLoading(null)
    }
  }

  return { handleSignOut }
}
