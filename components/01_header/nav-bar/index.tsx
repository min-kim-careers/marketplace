import { useToast } from '@/components/shadcn/hooks/use-toast'
import { ROUTES } from '@/lib/constants/routes'
import {
  auth,
  provider,
} from '@/lib/firebase/configs/client'
import { handleFirebaseError } from '@/lib/firebase/helpers'
import { firebaseGetProfileByToken } from '@/lib/firebase/service'
import useFirebaseStore from '@/lib/firebase/store'
import { serialize } from '@/lib/helpers/market'
import { useLoadingStore } from '@/lib/stores/loading'
import useProfileStore from '@/lib/stores/profile'
import { FirebaseError } from 'firebase/app'
import {
  signInWithPopup,
  signOut,
  UserCredential,
} from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '../../shadcn/components/ui/button'
import Dropdown from './dropdown'

export default function NavBar() {
  const { profile, setProfile } = useProfileStore()
  const { user } = useFirebaseStore()
  const { setMessage } = useLoadingStore()
  const { toast } = useToast()
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      setMessage('Signing you in')
      const { user }: UserCredential =
        await signInWithPopup(auth, provider)

      const idToken = await user.getIdToken()

      const profile =
        await firebaseGetProfileByToken(idToken)

      if (!profile) router.replace(ROUTES.PROFILE_COMPLETE)

      setProfile(profile)

      toast({
        description: `Welcome ${profile?.handle}!`,
      })
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast({
          description: handleFirebaseError(error),
        })
      } else {
        toast({
          description: 'Something went wrong.',
        })
      }
    } finally {
      setMessage(null)
    }
  }

  const handleSignOut = async () => {
    try {
      setMessage('Signing you out...')
      await signOut(auth)
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

  if (!user)
    return (
      <Button onClick={handleSignIn}>
        Sign in with Google
      </Button>
    )

  if (!profile)
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
