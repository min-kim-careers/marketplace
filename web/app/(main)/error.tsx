'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import Link from 'next/link'

export default function Error({
  error,
  // reset,
}: {
  error: Error & { digest?: string }
  // reset: () => void
}) {
  return (
    <div className='flex flex-1 items-center justify-center w-full h-full'>
      <div className='flex flex-col gap-4 rounded-xl border min-w-md p-6'>
        <p className='text-center'>{error.message}</p>
        <Button asChild>
          <Link href={APP_ROUTES.HOME.href}>Return to home</Link>
        </Button>
      </div>
    </div>
  )
}
