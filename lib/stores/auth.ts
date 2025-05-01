'use client'

import {
  signInWithGoogle as authSignInWithGoogle,
  signOut as authSignOut,
  signUpWithEmail as authSignUpWithEmail,
  deleteUser
} from '@/lib/api/auth'
import { Profile } from '@/lib/interfaces/profile'
import { z } from 'zod'
import { create } from 'zustand'
import { addProfile } from '../api/profile'
import { clearProfile } from '../cache/profile'

interface AuthStoreResult {
  success: boolean
  handle?: string
}

interface AuthStore {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void

  signIn: () => Promise<AuthStoreResult>
  signOut: () => Promise<AuthStoreResult>
}

const useAuthStore = create<AuthStore>((set) => ({
  profile: null,

  setProfile: (profile: Profile | null) => set({ profile }),

  signIn: async (): Promise<AuthStoreResult> => {
    const { success } = await authSignInWithGoogle()

    return { success: false }
  },

  signOut: async (): Promise<AuthStoreResult> => {
    const { success } = await authSignOut()

    if (!success) return { success: false }

    set({ profile: null })

    clearProfile()

    return { success: true }
  },
}))

export default useAuthStore
