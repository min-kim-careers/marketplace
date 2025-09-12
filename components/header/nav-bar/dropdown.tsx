import ChatDrawer from '@/chat/chat-drawer'
import LoadingDots from '@/components/loading-dots'
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
import { useAuthHandler } from '@/lib/hooks/auth/use-auth-handler'
import useProfileStore from '@/lib/stores/profile-store'
import { CircleUserIcon } from 'lucide-react'
import Link from 'next/link'

export default function Dropdown() {
  const { profile } = useProfileStore()
  const { handleSignOut } = useAuthHandler()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div>
          <Avatar>
            <AvatarImage src={profile && profile.avatarUrl} />
            <AvatarFallback>
              {profile ? (
                <CircleUserIcon className='h-full w-full' />
              ) : (
                <LoadingDots />
              )}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent side='bottom' align='end'>
        <DropdownMenuLabel>
          {profile ? profile.handle : <LoadingDots />}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <span className='visible sm:hidden'>
          <DropdownMenuItem>
            <Link href={`${APP_ROUTES.MARKET.href}`} passHref>
              Browse
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={APP_ROUTES.ITEM_POST.href}>Post Ad</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ChatDrawer />
          </DropdownMenuItem>
        </span>

        <DropdownMenuItem asChild>
          <Link href={APP_ROUTES.PROFILE_DASHBOARD.href}>Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={APP_ROUTES.PROFILE_LISTINGS.href}>Listings</Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
