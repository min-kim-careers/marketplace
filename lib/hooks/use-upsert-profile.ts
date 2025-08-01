'use client'

import { upsertProfile, _UpsertProfileRequest } from '@/api/service/profile'
import useProfileStore from '@/lib/stores/profile-store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useLoadingStore } from '../providers/loading-provider'

export const useUpdateProfile = () => {
  const { setProfile } = useProfileStore()
  const { setLoading } = useLoadingStore()
  const router = useRouter()

  const handleUpdateProfile = async (newProfile: _UpsertProfileRequest) => {
    let toastMsg = ''

    try {
      setLoading('Updating your profile...', true)

      const profile = await upsertProfile(newProfile)
      if (!profile) throw new Error('error updating profile')

      setProfile(profile)
      toastMsg = 'Your profile was updated successfully!'
      router.refresh()
    } catch (error) {
      toastMsg = `Something went wrong.`
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
  }

  return { handleUpdateProfile }
}
