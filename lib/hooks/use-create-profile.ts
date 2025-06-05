import { UpsertProfileRequest } from '@/_gateway/_common/_models/upsert-profile.request'
import { serviceUpdateCurrentProfile } from '@/_gateway/api/profiles/service'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { useLoadingStore } from '@/lib/stores/loading'
import useProfileStore from '@/lib/stores/profile'

export const useCreateProfile = () => {
  const { setProfile } = useProfileStore()
  const { setMessage } = useLoadingStore()
  const { toast } = useToast()

  const handleCreateProfile = async (
    newProfile: UpsertProfileRequest
  ) => {
    try {
      setMessage('Creating a new profile...')

      const profile = await serviceUpdateCurrentProfile(newProfile)
      if (!profile) throw new Error()

      setProfile(profile)

      toast({ description: `Profile updated!` })
    } catch (error) {
      toast({ description: `Something went wrong.` })
    } finally {
      setMessage(null)
    }
  }

  return { handleCreateProfile }
}
