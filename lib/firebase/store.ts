'use client'

import { User } from 'firebase/auth'
import { create } from 'zustand'

interface FirebaseStore {
  user: User | null
  setUser: (user: User | null) => void
}

const useFirebaseStore = create<FirebaseStore>((set) => {
  return {
    user: null,
    setUser: (user: User | null) =>
      set({
        user,
      }),
  }
})

export default useFirebaseStore
