'use client'

import { Profile } from '@/lib/interfaces/users'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void

  signIn: (
    email: string,
    password: string,
  ) => Promise<boolean>
  signOut: () => Promise<boolean>
}

const useAuthStore = create(
  persist<AuthStore>(
    (set) => {
      const signIn = async (
        email: string,
        password: string,
      ) => {
        try {
          const res = await fetch('/api/auth/sign-in', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            credentials: 'include',
          })

          if (!res.ok) throw new Error()

          const { profile } = await res.json()
          if (!profile) throw new Error()

          set({ profile })

          return true
        } catch (error) {
          return false
        }
      }

      const signOut = async () => {
        try {
          const res = await fetch('/api/auth/sign-out')

          if (!res.ok) throw new Error()

          return true
        } catch (error) {
          return false
        }
      }

      return {
        profile: null,
        setProfile: (profile: Profile | null) =>
          set({
            profile,
          }),

        signIn,
        signOut,
      }
    },
    {
      name: 'profile',
      partialize: (state) =>
        ({
          profile: state.profile,
        }) as AuthStore,
    },
  ),
)

export default useAuthStore
