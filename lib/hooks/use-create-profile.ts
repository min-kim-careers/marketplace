import { serviceUpsertProfile } from '@/_gateway/api/profiles/service'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { auth } from '@/lib/firebase/config'
import { useLoadingStore } from '@/lib/stores/loading'
import useProfileStore from '@/lib/stores/profile'

export const useCreateProfile = () => {
  const { setProfile } = useProfileStore()
  const { setMessage } = useLoadingStore()
  const { toast } = useToast()

  const handleCreateProfile = async (handle: string) => {
    try {
      setMessage('Creating a new profile...')

      const user = auth.currentUser
      if (!user || !user.email) throw new Error()
      const token = await user.getIdToken()
      const res = await serviceUpsertProfile(
        token,
        user.email,
        handle,
      )
      if (!res || !res.profile) throw new Error()
      setProfile(res.profile)

      toast({ description: `Welcome aboard, ${handle}!` })
    } catch (error) {
      toast({ description: `Something went wrong.` })
    } finally {
      setMessage(null)
    }
  }

  return { handleCreateProfile }
}
