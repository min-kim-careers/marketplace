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
import useProfileStore from '@/lib/stores/profile'
import Link from 'next/link'
import Spinner from '../../00_common/spinner'

export default function Dropdown({
  handleSignOut,
}: {
  handleSignOut: () => void
}) {
  const { profile } = useProfileStore()

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
          <Link href={ROUTES.PROFILE_UPDATE}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
