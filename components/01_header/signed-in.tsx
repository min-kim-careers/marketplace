import { toast } from '@/components/shadcn/hooks/use-toast'
import { ROUTES } from '@/lib/constants/routes'
import { useLoadingStore } from '@/lib/stores/loading'
import { paramsToQuery } from '@/lib/utils/helpers'
import Link from 'next/link'
import { Button } from '../shadcn/components/ui/button'
import Dropdown from './dropdown'

export default function SignedIn() {
  const { setLoading } = useLoadingStore()

  const handleSignOut = async () => {
    setLoading(true, 'Signing you out...')
    try {
      // await signOut(auth)

      toast({
        description: `Signed out successfully.`,
      })
    } catch (error) {
      toast({
        description: `Failed to sign out `,
      })
      return
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <span className='flex items-center justify-between gap-4'>
      <Link
        href={{
          pathname: ROUTES.MARKET,
          query: paramsToQuery({ page: 1 }),
        }}
        passHref
      >
        <Button>Browse</Button>
      </Link>
      <Link href={ROUTES.POST}>
        <Button>Post Ad</Button>
      </Link>
      <Dropdown handleSignOut={handleSignOut} />
    </span>
  )
}
