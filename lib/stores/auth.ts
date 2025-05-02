'use client'

import { User } from '@/lib/interfaces/user'
import { create } from 'zustand'


interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void

  initialised: boolean
  setInitialised: (b: boolean) => void
}

const useAuthStore = create<AuthStore>((set) => {
  return {
    user: null,
    setUser: (user: User | null) =>
      set({ user }),

    initialised: false,
    setInitialised: (initialised: boolean) =>
      set({ initialised }),
  }
})

export default useAuthStore
