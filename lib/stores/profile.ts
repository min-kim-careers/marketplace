'use client'

import { Profile } from '@/lib/interfaces/profiles'
import { create } from 'zustand'
import {
  persist,
  subscribeWithSelector,
} from 'zustand/middleware'

interface ProfileStore {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
}

const useProfileStore = create(
  subscribeWithSelector(
    persist<ProfileStore>(
      (set) => {
        return {
          profile: null,
          setProfile: (profile: Profile | null) =>
            set({
              profile,
            }),
        }
      },
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
