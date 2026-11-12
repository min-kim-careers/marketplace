'use client'

import { _UpsertProfileRequest } from '@/api/endpoints'
import {
  removeAvatar,
  uploadAvatar,
  upsertProfile,
} from '@/api/service/profile'
import { compressFile } from '@/lib/helpers/compress-image-from-url'
import useProfileStore from '@/lib/stores/profile-store'
import { Profile } from '@/lib/types/profile'
import { toast } from 'sonner'
import { useLoadingStore } from '../providers/loading-provider'

export const useProfileHandler = () => {
  const { setProfile } = useProfileStore()
  const { setLoading } = useLoadingStore()

  const handleUpsert = async (newProfile: _UpsertProfileRequest) => {
    let toastMsg = ''
    try {
      setLoading('Updating your profile...')

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

  const runAvatarAction = async (
    loadingMsg: string,
    successMsg: string,
    action: () => Promise<Profile | undefined>,
  ) => {
    let toastMsg = ''
    try {
      setLoading(loadingMsg)

      const profile = await action()
      if (!profile) throw new Error('error updating avatar')

      setProfile(profile)
      toastMsg = successMsg
    } catch (error) {
      console.error(error)
      toastMsg = 'Something went wrong.'
      return false
    } finally {
      setLoading()
      if (toastMsg) toast(toastMsg)
    }
    return true
  }

  const handleAvatarUpload = (file: File) =>
    runAvatarAction(
      'Uploading your profile image...',
      'Your profile image was updated!',
      async () => {
        // avatars render small; keep well under the 1MB server action body limit
        const compressed = await compressFile(file, file.name, {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 512,
        })
        const form = new FormData()
        form.append('avatar', compressed)
        return uploadAvatar(form)
      },
    )

  const handleAvatarRemove = () =>
    runAvatarAction(
      'Removing your profile image...',
      'Your profile image was removed.',
      removeAvatar,
    )

  return { handleUpsert, handleAvatarUpload, handleAvatarRemove }
}
