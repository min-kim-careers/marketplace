import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/components/ui/dropdown-menu'
import { ROUTES } from '@/lib/constants/routes'
import useAuthStore from '@/lib/stores/auth'
import Link from 'next/link'
import Spinner from '../../common/spinner'
import { useOverlayStore } from '@/lib/stores/overlay'
import { toast } from '@/components/shadcn/hooks/use-toast'
import { useRouter } from 'next/navigation'

export default function Dropdown() {
  const { profile, signOut } = useAuthStore()
  const { setOverlayMessage } = useOverlayStore()
  const router = useRouter()

  const handleSignOut = async () => {
    setOverlayMessage('Signing you out...')
    try {
      if (!await signOut()) throw new Error()

      toast({
        description: `Signed out successfully.`,
      })
      router.replace(ROUTES.HOME)
    } catch (err) {
      toast({
        description: `Failed to sign out `,
      })
      return
    } finally {
      setOverlayMessage(null)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>
            {profile ? profile.handle : <Spinner />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='end'>
        <DropdownMenuLabel>
          {profile ? profile.handle : <Spinner />}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={ROUTES.PROFILE}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
