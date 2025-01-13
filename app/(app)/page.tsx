'use client'

import AuthDialog from '@/components/auth-dialog'
import { Button } from '@/components/shadcn/components/ui/button'
import { toast } from '@/components/shadcn/hooks/use-toast'
import useAuthStore from '@/store/auth-store'
import Link from 'next/link'

export default function Home() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    toast({
      description: 'You have been logged out'
    })
  }

  return (
    <main className="flex flex-1 flex-col justify-between">
      <nav className="flex w-full max-w-3xl justify-between">
        <Link href="/" className="text-2xl font-bold">
          Marketplace
        </Link>

        <ul className="flex gap-4">
          <li>
            {user ? (
              <Button onClick={handleLogout}>Logout</Button>
            ) : (
              <AuthDialog>
                <Button>Login</Button>
              </AuthDialog>
            )}
          </li>
        </ul>
      </nav>
      <div className="flex flex-col items-center gap-8 sm:items-start">
        <h1 className="text-center text-4xl font-bold">
          Welcome to the Marketplace!
        </h1>
        {user ? (
          <p>Welcome, {user.email}!</p>
        ) : (
          <p>You are not logged in</p>
        )}
      </div>
      <footer className="flex flex-wrap items-center justify-start gap-6"></footer>
    </main>
  )
}
