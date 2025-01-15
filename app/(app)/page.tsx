'use client'

import useAuthStore from '@/store/auth-store'

export default function Home() {
  const { supabaseUser } = useAuthStore()

  return (
    <div className='flex flex-col items-center gap-8 sm:items-start'>
      <h1 className='text-center text-4xl font-bold'>
        Welcome to the Marketplace!
      </h1>
      {supabaseUser ? (
        <p>Welcome, {supabaseUser.handle}!</p>
      ) : (
        <p>You are not logged in</p>
      )}
    </div>
  )
}
