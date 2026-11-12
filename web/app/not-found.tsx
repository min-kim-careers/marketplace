import { Button } from '@/components/shadcn/components/ui/button'
import { APP_ROUTES } from '@/lib/constants/app-routes'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex w-full h-screen flex-1 flex-col items-center justify-center gap-6 p-4'>
      <h2 className='text-lg font-semibold'>Page not found!</h2>
      <Button>
        <Link href={APP_ROUTES.HOME.href}>Return Home</Link>
      </Button>
    </div>
  )
}
