'use client'

import {
  SignInResponse,
  SignOutResponse
} from '@/lib/api/auth/responses'
import { Profile } from '@/lib/interfaces/profiles'
import { create } from 'zustand'
import {
  persist,
  subscribeWithSelector,
} from 'zustand/middleware'
import {
  signIn as serverSignIn,
  signOut as serverSignOut
} from '../api/auth/service'

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
            const { success }: SignInResponse = await serverSignIn(
              email,
              password,
            )
            if (!success) throw new Error()
          } catch (error) {
            return false
          }
          return true
        }

        const signOut = async () => {
          try {
            const { success }: SignOutResponse = await serverSignOut()
            if (!success) throw new Error()
            set({ profile: null })
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
