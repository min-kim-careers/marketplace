'use client'

import Link from 'next/link'
import { Button } from './shadcn/components/ui/button'
import LoginDialog from './login-dialog'
import { toast } from './shadcn/hooks/use-toast'
import useAuthStore from '@/store/auth-store'

export default function NavBar() {
  const { firebaseUser: user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast({
      description: 'You have been logged out',
    })
  }

  return (
    <nav className='flex w-full justify-between p-2'>
      <Link href='/' className='text-2xl font-bold'>
        Marketplace
      </Link>

      <ul className='flex gap-4'>
        <li>
          {user ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <LoginDialog>
              <Button>Login</Button>
            </LoginDialog>
          )}
        </li>
      </ul>
    </nav>
  )
}
