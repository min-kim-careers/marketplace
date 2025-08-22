import LoadingDots from '@/components/loading-dots'
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
import Link from 'next/link'
import { PropsWithChildren } from 'react'

export default function Dropdown({ children }: PropsWithChildren) {
  const { profile } = useProfileStore()
  const { handleSignOut } = useAuthHandler()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
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

        <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
