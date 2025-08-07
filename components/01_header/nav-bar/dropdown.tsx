import LoadingDots from '@/components/00_common/loading-dots'
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
import { useAuthHandler } from '@/lib/hooks/use-auth-handler'
import useProfileStore from '@/lib/stores/profile-store'
import { CircleUserIcon } from 'lucide-react'
import Link from 'next/link'

export default function Dropdown({}: {}) {
  const { profile } = useProfileStore()
  const { handleSignOut } = useAuthHandler()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={profile?.avatarUrl} />
          <AvatarFallback>
            {profile ? (
              <CircleUserIcon className='h-full w-full' />
            ) : (
              <LoadingDots />
            )}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='end'>
        <DropdownMenuLabel>
          {profile ? profile.handle : <LoadingDots />}
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
