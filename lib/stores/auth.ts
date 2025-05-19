'use client'

import { Profile } from '@/lib/interfaces/users'
import { create } from 'zustand'
import {
  persist,
  subscribeWithSelector,
} from 'zustand/middleware'
import {
  signIn as serverSignIn,
  signOut as serverSignOut,
} from '../api/auth'

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
  subscribeWithSelector(
    persist<AuthStore>(
      (set) => {
        const signIn = async (
          email: string,
          password: string,
        ) => {
          try {
            const { profile } =
              await serverSignIn(email, password)

            set({ profile })

            return true
          } catch (error) {
            return false
          }
        }

        const signOut = async () => {
          try {
            const success = await serverSignOut()
            if (!success) throw new Error()

            set({ profile: null })
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
  ),
)

export default useAuthStore
