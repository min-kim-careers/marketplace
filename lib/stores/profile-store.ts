'use client'

import { Profile } from '@/lib/interfaces/profile'
import { create } from 'zustand'
import {
  persist,
  subscribeWithSelector,
} from 'zustand/middleware'

interface ProfileStore {
  profile: Profile | null
  getProfile: () => Profile
  setProfile: (profile: Profile | null) => void
}

const useProfileStore = create(
  subscribeWithSelector(
    persist<ProfileStore>(
      (set, get) => {
        return {
          profile: null,
          getProfile: () => {
            const profile = get().profile
            if (!profile) throw new Error()
            return profile
          },
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
