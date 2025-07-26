import { UPSERT_PROFILE } from '@/lib/clients/profile'
import useLoadingStore from '@/lib/stores/loading-store'
import useProfileStore from '@/lib/stores/profile-store'
import { UpsertProfileRequest } from '@gateway/api/profile'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const useUpsertProfile = () => {
  const { setProfile } = useProfileStore()
  const { setLoading } = useLoadingStore()
  const router = useRouter()

  const handleUpsertProfile = async (newProfile: UpsertProfileRequest) => {
    try {
      setLoading('Updating your profile...', true)

      const { profile } = await UPSERT_PROFILE(newProfile)
      setProfile(profile)

      toast('Your profile was updated successfully!')

      router.refresh()
    } catch (error) {
      toast(`Something went wrong.`)
    } finally {
      setLoading(null)
    }
  }

  return { handleUpsertProfile }
}
