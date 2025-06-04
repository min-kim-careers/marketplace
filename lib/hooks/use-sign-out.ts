import { serviceSignOut } from '@/_gateway/firebase/service'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { auth } from '@/lib/firebase/config'
import { useLoadingStore } from '@/lib/stores/loading'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export const useSignOut = () => {
  const { setMessage } = useLoadingStore()
  const { toast } = useToast()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setMessage('Signing you out...')

      await signOut(auth)
      await serviceSignOut()

      toast({
        description: `See you again!`,
      })
      router.refresh()
    } catch (error) {
      toast({
        description: `Something went wrong.`,
      })
    } finally {
      setMessage(null)
    }
  }

  return { handleSignOut }
}
