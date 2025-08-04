'use client'

import { _UpsertProfileRequest } from '@/api/endpoints'
import { upsertProfile } from '@/api/service/profile'
import useProfileStore from '@/lib/stores/profile-store'
import { toast } from 'sonner'
import { useLoadingStore } from '../providers/loading-provider'

export const useProfileHandler = () => {
  const { setProfile } = useProfileStore()
  const { setLoading } = useLoadingStore()

  const handleUpsert = async (newProfile: _UpsertProfileRequest) => {
    let toastMsg = ''
    try {
      setLoading('Updating your profile...', true)

      const profile = await upsertProfile(newProfile)
      if (!profile) throw new Error('error updating profile')

      setProfile(profile)
      toastMsg = 'Your profile was updated successfully!'
    } catch (error) {
      console.error(error)
      toastMsg = `Something went wrong.`
      return false
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
    return true
  }

  return { handleUpsert }
}
