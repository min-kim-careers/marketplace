import { useToast } from '@/components/shadcn/hooks/use-toast'
import { ROUTES } from '@/lib/constants/routes'
import { serialize } from '@/lib/helpers/market'
import { useLoadingStore } from '@/lib/stores/loading'
import useProfileStore from '@/lib/stores/profile'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '../../shadcn/components/ui/button'
import Dropdown from './dropdown'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, provider } from '@/lib/firebase/config'
import { serviceSignInWithGoogle } from '@/_gateway/firebase/service'

export default function NavBar() {
  const { profile, setProfile } = useProfileStore()
  const { setMessage } = useLoadingStore()
  const { toast } = useToast()
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      setMessage('Signing you in')
      const cred = await signInWithPopup(auth, provider)

      const token = await cred.user.getIdToken()

      const profile = await serviceSignInWithGoogle(token)
      if (!profile) throw new Error()

      toast({
        description: `Welcome ${profile?.handle}!`,
      })

      if (!profile.handle)
        router.replace(ROUTES.PROFILE_COMPLETE)

      router.refresh()

      setProfile(profile)
    } catch (error) {
      await signOut(auth)
      setProfile(null)
      toast({
        description: 'Something went wrong.',
      })
    } finally {
      setMessage(null)
    }
  }

  const handleSignOut = async () => {
    try {
      setMessage('Signing you out...')
      toast({
        description: `See you again!`,
      })
      setProfile(null)
      router.replace(ROUTES.HOME)
    } catch (error) {
      toast({
        description: `Something went wrong.`,
      })
    } finally {
      setMessage(null)
    }
  }

  if (!profile)
    return (
      <Button onClick={handleSignIn}>
        Sign in with Google
      </Button>
    )

  if (!profile.handle)
    return <Button onClick={handleSignOut}>Sign out</Button>

  return (
    <span className='flex items-center justify-between gap-4'>
      <Link
        href={{
          pathname: ROUTES.MARKET,
          query: serialize({ page: 1 }),
        }}
        passHref
      >
        <Button>Browse</Button>
      </Link>
      <Link href={ROUTES.ITEM_POST}>
        <Button>Post Ad</Button>
      </Link>
      <Dropdown handleSignOut={handleSignOut} />
    </span>
  )
}
