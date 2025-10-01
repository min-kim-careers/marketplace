'use client'

import { getProfile } from '@/api'
import { useAuthContext } from '@/lib/providers/auth-provider'
import useProfileStore from '@/lib/stores/profile-store'
import { useEffect } from 'react'

export const ProfileLoader = () => {
  const { status } = useAuthContext()
  const { profile, setProfile } = useProfileStore()

  useEffect(() => {
    const handleProfile = async () => {
      if (status === 'loading') return

      if (status === 'authenticated') {
        if (profile) {
          const newProfile = await getProfile()
          if (!newProfile) throw new Error('failed to get profile')
          setProfile(newProfile)
        }
      } else if (status === 'unauthenticated') {
        setProfile()
      }
    }

    handleProfile()
  }, [status])

  return null
}
