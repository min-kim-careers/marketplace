import useAuthStore from '@/lib/stores/auth'
import LoadingDots from './loading-dots'

export function AuthGate({
  children,
  fallback = <LoadingDots className='bg-black w-2 h-2' />,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { initialised } = useAuthStore()

  if (!initialised) return fallback
  return <>{children}</>
}
