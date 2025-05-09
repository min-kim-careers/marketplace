import { toast } from '@/components/shadcn/hooks/use-toast'
import { PATHNAMES } from '@/lib/constants/pathnames'
import { useOverlayStore } from '@/lib/stores/overlay'
import { serialize } from '@/lib/utils/params'
import Link from 'next/link'
import { Button } from '../../shadcn/components/ui/button'
import Dropdown from './dropdown'

export default function Nav() {
  const { setOverlayMessage: setLoadingMessage } = useOverlayStore()

  const handleSignOut = async () => {
    setLoadingMessage('Signing you out...')
    try {
      // await signOut(auth)

      toast({
        description: `Signed out successfully.`,
      })
    } catch (err) {
      toast({
        description: `Failed to sign out `,
      })
      return
    } finally {
      setLoadingMessage(null)
    }
  }
  
  return (
    <span className='flex items-center justify-between gap-4'>
      <Link
        href={{
          pathname: PATHNAMES.MARKET,
          query: serialize({ page: 1 }),
        }}
        passHref
      >
        <Button>Browse</Button>
      </Link>
      <Link href={PATHNAMES.POST}>
        <Button>Post Ad</Button>
      </Link>
      <Dropdown handleSignOut={handleSignOut} />
    </span>
  )
}
