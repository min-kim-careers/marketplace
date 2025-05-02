import useAuthStore from '@/lib/stores/auth'
import LoadingDots from '../ui/loading-dots'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'

export function AuthGate({
  children,
  fallback = <LoadingDots className='h-2 w-2 bg-black' />,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { profile, initialised } = useAuthStore()
  const router = useRouter()
  useEffect(() => {
    if (initialised && !!!profile) {
      router.replace(ROUTES.HOME)
    }
  }, [profile, initialised])

  if (!initialised) return fallback
  
  return <>{children}</>
}
