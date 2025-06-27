'use client'

import { IProfile } from '@/lib/interfaces/profile'
import { create } from 'zustand'
import {
  persist,
  subscribeWithSelector,
} from 'zustand/middleware'

interface ProfileStore {
  profile: IProfile | null
  getProfile: () => IProfile
  setProfile: (profile: IProfile | null) => void
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
          setProfile: (profile: IProfile | null) =>
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
