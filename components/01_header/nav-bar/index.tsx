import { ROUTES } from '@/lib/constants/routes'
import { serialize } from '@/lib/helpers/market'
import Link from 'next/link'
import { Button } from '../../shadcn/components/ui/button'
import Dropdown from './dropdown'

export default function NavBar() {  
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
      <Link href={ROUTES.ITEM_POST}>
        <Button>Post Ad</Button>
      </Link>
      <Dropdown />
    </span>
  )
}
