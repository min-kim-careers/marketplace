'use client'

import { Profile } from '@/lib/types/profile'
import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'

interface ProfileStore {
  profile?: Profile
  setProfile: (profile?: Profile) => void
}

const useProfileStore = create(
  subscribeWithSelector(
    persist<ProfileStore>(
      (set) => ({
        setProfile: (profile?: Profile) =>
          set({
            profile,
          }),
      }),
      {
        name: 'profile',
        partialize: (state) =>
          ({
            profile: state.profile,
          }) as ProfileStore,
      },
    ),
  ),
)

export default useProfileStore
