import useAuthStore from '@/lib/stores/auth'
import LoadingDots from './widgets/loading-dots'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { PROTECTED_ROUTES, ROUTES } from '@/lib/constants/routes'

export function AuthGate({
  children,
  fallback = <LoadingDots className='h-2 w-2 bg-black' />,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { user, initialised } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    if (initialised && !!!user && PROTECTED_ROUTES.includes(pathname)) {
      router.replace(ROUTES.HOME)
    }
  }, [user, initialised, pathname])

  if (!initialised) return fallback
  
  return <>{children}</>
}
