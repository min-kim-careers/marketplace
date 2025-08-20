'use client'

import { AuthState } from '@/lib/providers/auth-provider'
import { useMemo, useState } from 'react'

export const useAuthStatus = () => {
  const [status, setStatus] = useState<AuthState['status']>({
    server: 'loading',
    client: 'loading',
  })

  const isLoading = status.server === 'loading' || status.client === 'loading'

  const isAuthenticated =
    status.server === 'authenticated' && status.client === 'authenticated'

  return useMemo(
    () => ({
      status,
      setStatus,
      isLoading,
      isAuthenticated,
    }),
    [status, isLoading, isAuthenticated],
  )
}
