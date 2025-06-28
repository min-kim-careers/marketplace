'use client'

import { User } from 'firebase/auth'
import { create } from 'zustand'

interface FirebaseState {
  user: User | null
  setUser: (user: User | null) => void
  getToken:  () =>  Promise<string | null>
}

const useFirebaseStore = create<FirebaseState>((set, get) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
  getToken: async () => {
    const user = get().user
    if (!user) return null
    return await user.getIdToken()
  }
}))

export default useFirebaseStore
