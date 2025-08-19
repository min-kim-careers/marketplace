'use client'

import { getProfile } from '@/api'
import { useAuthContext } from '@/lib/providers/auth-provider'
import useProfileStore from '@/lib/stores/profile-store'
import { useEffect } from 'react'


export const ProfileLoader = () => {
  const { isAuthenticated } = useAuthContext()
  const { profile, setProfile } = useProfileStore()

  const fetchProfile = async () => {
    const profile = await getProfile()
    if (!profile) throw new Error('failed to get profile')
    setProfile(profile)
  }

  useEffect(() => {
    const handleProfile = async () => {
      if (!isAuthenticated) return

      try {
        profile ? await fetchProfile() : setProfile()
      } catch (error) {
        console.log(error)
      }
    }

    handleProfile()
  }, [isAuthenticated])

  return null
}