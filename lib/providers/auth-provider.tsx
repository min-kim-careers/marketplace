'use client'

import useFirebaseStore from '@/lib/stores/firebase-store'
import { auth } from '@/lib/utils/firebase'
import { onIdTokenChanged } from 'firebase/auth'
import { usePathname } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'
export type AuthState = {
  status: AuthStatus
}

const AuthContext = createContext<AuthState | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const [status, setStatus] = useState<AuthState['status']>('loading')

  const { setUser } = useFirebaseStore()
  const user = useFirebaseStore((state) => state.user)

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser)
        setStatus('authenticated')
      } else {
        setUser()
        setStatus('unauthenticated')
      }
    })
    return () => unsub()
  }, [setUser])

  useEffect(() => {
    if (status === 'loading') return

    const handleAuth = async () => {
      if (user) {
        setStatus('authenticated')
      } else {
        setStatus('unauthenticated')
      }
    }

    handleAuth()
  }, [user, pathname])

  return (
    <AuthContext.Provider
      value={{
        status,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('Not inside provider')
  return ctx
}
