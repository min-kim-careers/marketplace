import { Button } from '@/components/shadcn/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex min-w-full flex-1 flex-col items-center justify-center gap-2 p-4'>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Button>
        <Link href='/'>Return Home</Link>
      </Button>
    </div>
  )
}
