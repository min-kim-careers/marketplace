'use client'

import { Profile } from '@/lib/interfaces/profiles'
import { create } from 'zustand'
import {
  persist,
  subscribeWithSelector,
} from 'zustand/middleware'

interface AuthStore {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void

  signInWithGoogle: (
    email: string,
    password: string,
  ) => Promise<boolean>
  signOut: () => Promise<boolean>
}

const useAuthStore = create(
  subscribeWithSelector(
    persist<AuthStore>(
      (set) => {
        const signInWithGoogle = async (
          email: string,
          password: string,
        ) => {
          try {
          } catch (error) {
            return false
          }
          return true
        }

        const signOut = async () => {
          try {
          } catch (error) {
            return false
          }
          return true
        }

        return {
          profile: null,
          setProfile: (profile: Profile | null) =>
            set({
              profile,
            }),

          signInWithGoogle,
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
  ),
)

export default useAuthStore
