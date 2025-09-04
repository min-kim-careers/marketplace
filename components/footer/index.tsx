import { APP_DATA } from '@/lib/constants/app-data'

export default function Footer() {
  return (
    <div className='flex flex-1 flex-col items-start gap-2 pb-2 text-xs'>
      <div>
        <p>{APP_DATA.TITLE}</p>
      </div>
      <div>
        <p>All trademarks are owned by their respective owners.</p>
        <p>
          {APP_DATA.TITLE} is an independent community website which has no
          association with nor endorsement by the respective trademark owners.
        </p>
      </div>
      <div>Copyright © 2025-2025 {APP_DATA.TITLE} ABN: 00 000 000 000</div>
    </div>
  )
}
