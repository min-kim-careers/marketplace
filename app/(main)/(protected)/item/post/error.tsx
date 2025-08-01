'use client'

import { Button } from '@/components/shadcn/components/ui/button'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import Link from 'next/link'

export default function Error() {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <p className='flex flex-col gap-4 rounded-xl border p-6'>
        You've exceeded your listings limit.
        <Button asChild>
          <Link href={APP_ROUTES.PROFILE_LISTINGS.href}>Go to my listings</Link>
        </Button>
      </p>
    </div>
  )
}
