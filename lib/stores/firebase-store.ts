'use client'

import { User } from 'firebase/auth'
import { create } from 'zustand'

interface FirebaseState {
  user?: User
  setUser: (user?: User) => void
  getToken:  () =>  Promise<string | undefined>
}

const useFirebaseStore = create<FirebaseState>((set, get) => ({
  setUser: (user: User | undefined) => set({ user }),
  getToken: async () => {
    const user = get().user
    if (!user) return
    return await user.getIdToken()
  }
}))

export default useFirebaseStore
