import { UpsertProfileRequest } from "@/_gateway/api/profile/service"
import { updateCurrentProfile } from '@/_gateway/api/profile/service'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { useLoadingStore } from '@/lib/stores/loading'
import useProfileStore from '@/lib/stores/profile'
import { useRouter } from 'next/navigation'

export const useUpdateProfile = () => {
  const { setProfile } = useProfileStore()
  const { setLoading } = useLoadingStore()
  const { toast } = useToast()
  const router = useRouter()

  const handleUpdateProfile = async (
    newProfile: UpsertProfileRequest,
  ) => {
    try {
      setLoading('Updating your profile...', true)

      const profile =
        await updateCurrentProfile(newProfile)
      if (!profile)
        throw new Error('Failed to update profile')

      setProfile(profile)

      toast({
        description:
          'Your profile was updated successfully!',
      })

      router.refresh()
    } catch (error) {
      toast({ description: `Something went wrong.` })
    } finally {
      setLoading(null)
    }
  }

  return { handleUpdateProfile }
}
