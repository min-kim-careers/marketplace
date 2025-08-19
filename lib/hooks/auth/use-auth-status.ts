'use client'

import { AuthState } from '@/lib/providers/auth-provider'
import { useState } from 'react'

export const useAuthStatus = () => {
  const [status, setStatus] = useState<AuthState['status']>({
    server: 'loading',
    client: 'loading',
  })

  return {
    status,
    setStatus,
    isLoading: status.server === 'loading' || status.client === 'loading',
    isAuthenticated:
      status.server === 'authenticated' && status.client === 'authenticated',
  }
}
