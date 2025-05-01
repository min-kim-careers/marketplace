'use client'

import { Profile } from '@/lib/interfaces/profile'
import { create } from 'zustand'


interface AuthStore {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void

  initialised: boolean
  setInitialised: (b: boolean) => void
}

const useAuthStore = create<AuthStore>((set) => {
  return {
    profile: null,
    setProfile: (profile: Profile | null) =>
      set({ profile }),

    initialised: false,
    setInitialised: (initialised: boolean) =>
      set({ initialised }),
  }
})

export default useAuthStore
