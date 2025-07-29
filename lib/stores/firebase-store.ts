'use client'

import { User } from 'firebase/auth'
import { create } from 'zustand'

interface FirebaseState {
  user?: User
  setUser: (user?: User) => void
}

const useFirebaseStore = create<FirebaseState>((set) => ({
  setUser: (user: User | undefined) => set({ user }),
}))

export default useFirebaseStore
