'use client'

import { verifySession } from '@/api/service/auth'
import { useAuthHandler } from '@/lib/hooks/auth/use-auth-handler'
import { useAuthStatus } from '@/lib/hooks/auth/use-auth-status'
import { useAuthClient } from '@/lib/hooks/auth/use-auth-client'
import { ProfileLoader } from '@/components/profile-loader'
import { usePathname } from 'next/navigation'
import { createContext, ReactNode, useContext, useEffect } from 'react'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthState {
  status: {
    client: AuthStatus
    server: AuthStatus
  }
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthState | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { handleSignOut, refreshSession } = useAuthHandler()

  const { status, setStatus, isAuthenticated, isLoading } = useAuthStatus()

  const { user } = useAuthClient(setStatus)

  const pathname = usePathname()

  useEffect(() => {
    const authenticateServer = async () => {
      if (status.client !== 'authenticated') return

      try {
        const authenticated = await verifySession()
        if (!authenticated && user) {
          console.log('invalid session')
          const refreshed = await refreshSession(user)
          if (!refreshed) {
            throw new Error('session refresh failed')
          }
        }
        setStatus((p) => ({ ...p, server: 'authenticated' }))
      } catch (error) {
        console.error(error)
        setStatus((p) => ({ ...p, server: 'unauthenticated' }))
        await handleSignOut()
      }
    }

    authenticateServer()
  }, [status.client, pathname])

  return (
    <AuthContext.Provider
      value={{
        status,
        isAuthenticated,
        isLoading,
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
