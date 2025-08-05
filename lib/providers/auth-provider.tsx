'use client'

import { signInWithGoogle } from '@/api/service/auth'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import { hasSession } from '@/lib/helpers/server/has-session'
import { toPath } from '@/lib/helpers/to-path'
import { useAuthHandler } from '@/lib/hooks/use-auth-handler'
import useFirebaseStore from '@/lib/stores/firebase-store'
import useProfileStore from '@/lib/stores/profile-store'
import { auth } from '@/lib/utils/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface AuthState {
  authenticated: boolean
  authReady: boolean
}

const AuthContext = createContext<AuthState | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { profile, setProfile } = useProfileStore()
  const { user, setUser } = useFirebaseStore()
  const { handleSignOut } = useAuthHandler()
  const pathname = usePathname()

  const [authReady, setAuthReady] = useState<boolean>(false)

  const refreshSession = async (user: User) => {
    try {
      const token = await user.getIdToken(true)
      const profile = await signInWithGoogle(token)
      if (!profile) throw new Error('failed to refresh session')

      setProfile(profile)
    } catch (error) {
      console.error(error)
      await handleSignOut()
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      user ? setUser(user) : setUser()
      setAuthReady(true)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const handleAuth = async () => {
      if (!authReady) return

      if (user) {
        if (!(await hasSession())) {
          await refreshSession(user)
        }
      }

      if (!user) {
        if (profile) {
          setProfile()
        }
        if (await hasSession()) {
          await handleSignOut()
        }
      }
    }

    handleAuth()
  }, [authReady, user, profile, pathname])

  return (
    <AuthContext.Provider
      value={{
        authenticated: Boolean(authReady && user && profile),
        authReady,
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
