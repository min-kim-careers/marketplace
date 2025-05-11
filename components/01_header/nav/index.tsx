import { toast } from '@/components/shadcn/hooks/use-toast'
import { ROUTES } from '@/lib/constants/routes'
import { useOverlayStore } from '@/lib/stores/overlay'
import { serialize } from '@/lib/utils/params'
import Link from 'next/link'
import { Button } from '../../shadcn/components/ui/button'
import Dropdown from './dropdown'

export default function Nav() {  
  return (
    <span className='flex items-center justify-between gap-4'>
      <Link
        href={{
          pathname: ROUTES.MARKET,
          query: serialize({ page: 1 }),
        }}
        passHref
      >
        <Button>Browse</Button>
      </Link>
      <Link href={ROUTES.POST}>
        <Button>Post Ad</Button>
      </Link>
      <Dropdown />
    </span>
  )
}
