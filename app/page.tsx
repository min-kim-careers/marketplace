'use client'

import AuthDialog from '@/components/auth-dialog'
import { Button } from '@/components/shadcn/components/ui/button'
import useAuthStore from '@/store/auth-store'
import Link from 'next/link'

export default function Home() {
  const { user, logout } = useAuthStore()

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <nav className="flex w-full max-w-3xl justify-between">
        <Link href="/" className="text-2xl font-bold">
          Marketplace
        </Link>

        <ul className="flex gap-4">
          <li>
            {user ? (
              <Button onClick={logout}>Logout</Button>
            ) : (
              <AuthDialog
                trigger={<Button>Login</Button>}
              />
            )}
          </li>
        </ul>
      </nav>
      <main className="flex flex-col items-center gap-8 sm:items-start">
        <h1 className="text-center text-4xl font-bold">
          Welcome to Marketplace!
        </h1>
        {user ? (
          <p>Welcome, {user.email}!</p>
        ) : (
          <p>You are not logged in</p>
        )}
      </main>
      <footer className="flex flex-wrap items-center justify-center gap-6">
        A footer
      </footer>
    </div>
  )
}
