'use client'

import { User } from '@/lib/interfaces/users'
import { create } from 'zustand'
import { signIn as serverSignIn } from '../api/auth'
import { signUp as serverSignUp } from '../api/user'
import { AuthResponse } from '../interfaces/auth/response'
import { UserResponse } from '../interfaces/users/response'

interface AuthStore {
  user: User | null
  setUser: (user: User | null) => void

  initialised: boolean
  setInitialised: (b: boolean) => void
}

const useAuthStore = create<AuthStore>((set) => {
  return {
    user: null,
    setUser: (user: User | null) => set({ user }),

    initialised: false,
    setInitialised: (initialised: boolean) =>
      set({ initialised }),
  }
})

export default useAuthStore
