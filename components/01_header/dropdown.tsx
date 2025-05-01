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
import Spinner from '../ui/spinner'

export default function Dropdown({
  handleSignOut,
}: {
  handleSignOut: () => void
}) {
  const { profile } = useAuthStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>
            {profile ? (
              profile.handle[0].toUpperCase()
            ) : (
              <Spinner />
            )}
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
