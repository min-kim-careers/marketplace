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
import { APP_ROUTES } from '@/lib/constants/app-routes'
import useProfileStore from '@/lib/stores/profile-store'
import Link from 'next/link'
import Spinner from '../../00_common/spinner'
import { useSignOut } from '@/lib/hooks/use-sign-out'
import { CircleUserIcon } from 'lucide-react'

export default function Dropdown({}: {}) {
  const { profile } = useProfileStore()
  const { handleSignOut } = useSignOut()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={profile?.avatarUrl} />
          <AvatarFallback>
            {profile ? (
              <CircleUserIcon className='h-full w-full' />
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
          <Link href={APP_ROUTES.PROFILE_DASHBOARD.href}>Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={APP_ROUTES.PROFILE_LISTINGS.href}>Listings</Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
