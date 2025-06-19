import { UpsertProfileRequest } from "@/_gateway/api/profile/service"
import { UPDATE_PROFILE } from '@/_gateway/api/profile/service'
import { useToast } from '@/components/shadcn/hooks/use-toast'
import { useLoadingStore } from '@/lib/stores/loading-store'
import useProfileStore from '@/lib/stores/profile-store'
import { useRouter } from 'next/navigation'

export const useUpsertProfile = () => {
  const { setProfile } = useProfileStore()
  const { setLoading } = useLoadingStore()
  const { toast } = useToast()
  const router = useRouter()

  const handleUpsertProfile = async (
    newProfile: UpsertProfileRequest,
  ) => {
    try {
      setLoading('Updating your profile...', true)

      const profile =
        await UPDATE_PROFILE(newProfile)
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

  return { handleUpdateProfile: handleUpsertProfile }
}
