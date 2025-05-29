'use client'

import {
  SignInServiceResponse,
  SignOutServiceResponse,
} from '@/_gateway/auth/responses'
import {
  serviceSignIn,
  serviceSignOut,
} from '@/_gateway/auth/service'
import { Profile } from '@/lib/interfaces/profiles'
import { create } from 'zustand'
import {
  persist,
  subscribeWithSelector,
} from 'zustand/middleware'

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
            const {
              success,
              profile,
            }: SignInServiceResponse = await serviceSignIn(
              email,
              password,
            )
            if (!success) throw new Error()
            set({ profile })
          } catch (error) {
            return false
          }
          return true
        }

        const signOut = async () => {
          try {
            const { success }: SignOutServiceResponse =
              await serviceSignOut()
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
