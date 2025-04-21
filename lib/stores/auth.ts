'use client'

import { LoginFormSchema } from '@/components/02_main/auth/login/schema'
import { SignupFormSchema } from '@/components/02_main/auth/signup/schema'
import { Profile } from '@/lib/interfaces/profile'
import {
  login as authLogin,
  logout as authLogout,
  signup as authSignup,
} from '@/lib/server/auth'
import { z } from 'zod'
import { create } from 'zustand'
import {
  persist,
  createJSONStorage,
} from 'zustand/middleware'
import { addProfile, fetchProfile } from '../server/profile'

interface AuthStoreResult {
  success: boolean
  handle?: string
}

interface AuthStore {
  profile: Profile | null
  setProfile: (profile: Profile) => void

  login: (
    formData: z.infer<typeof LoginFormSchema>,
  ) => Promise<AuthStoreResult>
  signup: (
    formData: z.infer<typeof SignupFormSchema>,
  ) => Promise<AuthStoreResult>
  logout: () => Promise<AuthStoreResult>

  hasHydrated: boolean
  setHasHydrated: () => void
}

const useAuthStore = create<AuthStore>()(
  persist<AuthStore>(
    (set, get) => {
      const login = async (
        formData: z.infer<typeof LoginFormSchema>,
      ): Promise<AuthStoreResult> => {
        const { userId } = await authLogin(formData)

        if (!!!userId) return { success: false }

        const { data, success } = await fetchProfile(userId)

        if (!success) return { success: false }

        const profile: Profile = data

        set({ profile })

        return { success: true, handle: profile.handle }
      }

      const signup = async (
        formData: z.infer<typeof SignupFormSchema>,
      ): Promise<AuthStoreResult> => {
        const { success: signupSuccess, userId } =
          await authSignup(formData)

        if (!signupSuccess || !!!userId)
          return { success: false }

        const profile: Profile = {
          userId,
          email: formData.email,
          handle: formData.handle,
          rating: 0,
          ratingCount: 0,
          avatarUrl: '',
          location: '',
        }

        const { success } = await addProfile(profile)

        if (!success) {
          logout()
          return { success: false }
        }

        return { success: true, handle: formData.handle }
      }

      const logout = async (): Promise<AuthStoreResult> => {
        const profile = get().profile

        if (!!!profile) return { success: false }

        const { success } = await authLogout()

        if (!success) return { success: false }

        set({ profile: null })

        return { success: true, handle: profile.handle }
      }

      return {
        profile: null,
        setProfile: (profile: Profile) => set({ profile }),

        login,
        signup,
        logout,

        hasHydrated: false,
        setHasHydrated: () => set({ hasHydrated: true }),
      }
    },
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => () =>
        state.setHasHydrated(),
      partialize: (state) =>
        ({ profile: state.profile }) as AuthStore,
    },
  ),
)

export default useAuthStore
